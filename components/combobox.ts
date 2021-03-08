import {
    css,
    CSSResult,
    customElement,
    html,
    LitElement,
    property,
    TemplateResult,
} from "lit-element";

export type ComboboxBehaviour = "static" | "manual" | "auto";

@customElement("ex-combobox")
export class Combobox extends LitElement {
    @property()
    public behaviour: ComboboxBehaviour = "static";

    private get input(): HTMLInputElement {
        const slot = this.shadowRoot?.querySelector('slot[name="input"]') as HTMLSlotElement;
        if (slot === null || slot === undefined) throw new Error("Can't find input slot.");
        const input = slot
            .assignedNodes({ flatten: true })
            .find(n => n instanceof HTMLInputElement);
        if (input === undefined) throw new Error('"input" slot must contain an input element.');
        return input as HTMLInputElement;
    }

    private get popup(): HTMLElement {
        const slot = this.shadowRoot?.querySelector('slot[name="popup"]') as HTMLSlotElement;
        if (slot === null || slot === undefined) throw new Error("Can't find popup slot.");
        const popup = slot.assignedNodes().find(n => n instanceof HTMLElement);
        if (popup === undefined) throw new Error('"popup" slot must contain an element.');
        return popup as HTMLElement;
    }

    private handleInputKeydown(event: KeyboardEvent): void {
        if (event.key === "ArrowDown") {
            this.popup.focus();
        }
    }

    firstUpdated(): void {
        this.input.addEventListener("keydown", this.handleInputKeydown.bind(this));
    }

    static get styles(): CSSResult {
        return css`
            .popup-wrapper:not(:focus-within) {
                display: none;
            }
            .input-wrapper:focus-within ~ .popup-wrapper,
            .popup-wrapper:focus-within {
                display: block;
            }
        `;
    }

    render(): TemplateResult {
        return html`
            <div part="wrapper" role="presentation">
                <div class="input-wrapper" role="presentation">
                    <slot name="input"></slot>
                </div>
                <div class="popup-wrapper" role="presentation">
                    <slot name="popup"></slot>
                </div>
            </div>
        `;
    }
}
