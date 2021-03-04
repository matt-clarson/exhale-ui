type AttrDef = [attribute: string, value: string];
type FAttrDef = [attribute: string, value: string | null];

export function assignAttribute(el: HTMLElement): (attr: AttrDef) => boolean;
export function assignAttribute(el: HTMLElement, attr: AttrDef): boolean;
export function assignAttribute(
    el: HTMLElement,
    attr?: AttrDef
): boolean | ((attr: AttrDef) => boolean) {
    const partial = ([attribute, value]: AttrDef) => {
        if (el.hasAttribute(attribute)) return false;
        el.setAttribute(attribute, value);
        return true;
    };

    return attr === undefined ? partial : partial(attr);
}

export function forceAttribute(el: HTMLElement): (attr: FAttrDef) => void;
export function forceAttribute(el: HTMLElement, attr: FAttrDef): void;
export function forceAttribute(
    el: HTMLElement,
    attr?: FAttrDef
): void | ((attr: FAttrDef) => void) {
    const partial = ([attribute, value]: FAttrDef) => {
        if (value === null) {
            el.removeAttribute(attribute);
        } else {
            el.setAttribute(attribute, value);
        }
    };
    return attr === undefined ? partial : partial(attr);
}

export function assignAttributes(el: HTMLElement): (...attrs: AttrDef[]) => void {
    return (...attrs) => attrs.forEach(assignAttribute(el));
}

export function forceAttributes(el: HTMLElement): (...attrs: FAttrDef[]) => void {
    return (...attrs) => attrs.forEach(forceAttribute(el));
}

export const ariaBoolConverter = {
    fromAttribute: (value?: string | null): boolean => value === "true",
    toAttribute: (value?: boolean): string => (!!value).toString(),
};
