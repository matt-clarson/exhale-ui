import {
    css,
    CSSResult,
    customElement,
    html,
    LitElement,
    property,
    queryAssignedNodes,
    TemplateResult,
} from "lit-element";
import { assignAttributes, forceAttribute } from "../internal/utils";
import { OptionSelectEvent, optionSelectEvent } from "../shared";

const ALLOWED_KEYS = ["ArrowUp", "ArrowDown", "Home", "End", " "];

/**
 * An implementation of the "listbox" role - https://www.w3.org/TR/wai-aria-1.1/#listbox.
 *
 * @slot - Default slot should contain one or more {@link Option} elements.
 * @fires change - Fires when any `Option` in the `Listbox` fires a `change` event.
 *                 Note that this event is a separate event to that fired by the `Option`s.
 */
@customElement("ex-listbox")
export class Listbox extends LitElement {
    @queryAssignedNodes()
    private defaultSlotted?: Node[];
    /**
     * The `delimiter` is used to delimit the `value` property.
     */
    @property()
    public delimiter = ",";
    /**
     * The `value` of the `Listbox` is a delimited list of all the values of selected `Option`s (see the `delimiter` property).
     * Note, you cannot set the `value` property manually.
     */
    public get value(): string {
        return this.values.join(this.delimiter);
    }

    /**
     * The `values` of the `Listbox` is all of the selected options as an array.
     */
    public get values(): string[] {
        return this.options()
            .filter(o => !o.hasAttribute("aria-disabled") || o.getAttribute("value") !== null)
            .map(o => o.getAttribute("value") as string);
    }

    /**
     * Whether or not to force selection of options as a separate action.
     * If this is set, focusing on an option will not select it. You have to press "Space" to select the option.
     * If this is unset, focusing an option will select it.
     * Note that this will be ignored if the `aria-multiselectable` attribute is set to `"true"`.
     */
    @property({ type: Boolean })
    public forceSelect = false;
    /**
     * Sets whether the listbox is in single-select or multi-select mode.
     */
    @property({ attribute: "aria-multiselectable", type: Boolean, reflect: true })
    public multiSelect = false;
    /**
     * Sets the listbox to readonly mode - in readonly mode, the listbox will not allow selection of options.
     */
    @property({ attribute: "aria-readonly", type: Boolean, reflect: true })
    public readonly = false;

    constructor() {
        super();

        this.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    private options(): HTMLElement[] {
        return (this.defaultSlotted?.filter(n => n instanceof HTMLElement) ?? []) as HTMLElement[];
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (!ALLOWED_KEYS.includes(event.key) || this.readonly) return;

        const options = this.options();
        const idx = this.changeFocusedOption(options, event.key);

        if (idx === -1 || this.readonly) return;

        if (!this.forceSelect && !this.multiSelect) {
            options.forEach((option, i) =>
                option.dispatchEvent(optionSelectEvent({ selected: i === idx }))
            );
        } else if (this.forceSelect && !this.multiSelect && event.key === " ") {
            options.forEach((option, i) =>
                option.dispatchEvent(
                    optionSelectEvent({
                        selected: i === idx && option.getAttribute("aria-selected") !== "true",
                    })
                )
            );
        } else if (this.multiSelect && event.key === " ") {
            const option = options[idx];
            option.dispatchEvent(optionSelectEvent({ toggle: true }));
        }
    }

    private changeFocusedOption(options: HTMLElement[], key: string): number {
        const focusedIdx = options.findIndex(o => o === document.activeElement);
        const isDisabled = (i: number) =>
            options[i].getAttribute("aria-disabled") === "true" ||
            options[i].hasAttribute("disabled");
        let nextIdx: number;

        if (key === "ArrowDown" && focusedIdx < options.length - 1) {
            nextIdx = focusedIdx + 1;
            while (nextIdx < options.length && isDisabled(nextIdx)) {
                nextIdx += 1;
            }
        } else if (key === "ArrowUp" && focusedIdx > 0) {
            nextIdx = focusedIdx - 1;
            while (nextIdx > 0 && isDisabled(nextIdx)) {
                nextIdx -= 1;
            }
        } else if (key === "Home") {
            nextIdx = 0;
            while (nextIdx < options.length && isDisabled(nextIdx)) {
                nextIdx += 1;
            }
        } else if (key === "End") {
            nextIdx = options.length - 1;
            while (nextIdx > 0 && isDisabled(nextIdx)) {
                nextIdx -= 1;
            }
        } else nextIdx = focusedIdx;

        options[nextIdx]?.focus();
        return nextIdx;
    }

    private handleDefaultSlotChange(): void {
        const options = this.options();
        options.forEach(option => {
            option.addEventListener("click", () => {
                if (this.readonly) return;
                if (this.multiSelect) {
                    option.dispatchEvent(optionSelectEvent({ toggle: true }));
                } else {
                    options.forEach(o =>
                        o.dispatchEvent(optionSelectEvent({ selected: o === option }))
                    );
                }
            });
            option.addEventListener("ex:optionselect", ((event: OptionSelectEvent) => {
                const target = event.target as HTMLElement;
                if (this.multiSelect || event.detail.selected)
                    forceAttribute(this, ["aria-activedescendant", target.id]);
            }) as EventListener);

            option.addEventListener("change", () => {
                this.dispatchEvent(new Event("change"));
            });
        });
    }

    static get styles(): CSSResult {
        return css`
            :host {
                display: block;
                border: 1px solid black;
                width: min-content;
            }
        `;
    }

    connectedCallback(): void {
        super.connectedCallback();
        if (!this.isConnected) return;
        assignAttributes(this)(["role", "listbox"], ["tabindex", "0"]);
    }

    render(): TemplateResult {
        return html`<slot @slotchange=${this.handleDefaultSlotChange.bind(this)}></slot>`;
    }
}
