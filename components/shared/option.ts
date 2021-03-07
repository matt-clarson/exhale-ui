import {
    css,
    CSSResult,
    customElement,
    html,
    LitElement,
    property,
    TemplateResult,
} from "lit-element";
import { ariaBoolConverter, assignAttributes } from "../internal/utils";

/*
 * An implementation of the "option" role - https://www.w3.org/TR/2010/WD-wai-aria-20100916/roles#option.
 *
 * @fires change - When the `aria-selected` attribute changes, `Option` fires a `change` event.
 * @cssparts wrapper - A block wrapper around the value display.
 */
@customElement("ex-option")
export class Option extends LitElement {
    /**
     * The value of the option.
     */
    @property()
    public value?: string;

    private _selected = false;
    /**
     * Indicates the selected state of the option.
     * @default false
     */
    @property({ attribute: "aria-selected", converter: ariaBoolConverter, reflect: true })
    public get selected(): boolean {
        return this._selected;
    }

    public set selected(value: boolean) {
        console.log("setter called on", this.value, "with", value);
        if (!this.disabled) {
            const oldValue = this._selected;
            this._selected = value;
            this.requestUpdate("selected", oldValue);
        }
    }
    /**
     * Sets the option as disabled. If `true`, the option will not respond to any events.
     */
    @property({ attribute: "aria-disabled", type: Boolean, reflect: true })
    public disabled = false;

    constructor() {
        super();

        const stopOnDisabled = (event: Event) => {
            console.log("Disabled", this.disabled);
            if (this.disabled) event.stopImmediatePropagation();
        };
        this.addEventListener("click", stopOnDisabled);
        this.addEventListener("focus", stopOnDisabled);
        this.addEventListener("blur", stopOnDisabled);
    }

    /**
     * @private
     */
    public focus(): void {
        if (!this.disabled) super.focus();
    }

    connectedCallback(): void {
        super.connectedCallback();
        if (!this.isConnected) return;
        assignAttributes(this)(
            ["role", "option"],
            ["tabindex", "-1"],
            ["id", `${Math.random().toString(16).slice(2)}-option`]
        );
    }

    updated(changed: Map<string, string | boolean>): void {
        if (changed.has("selected") && !this.disabled) {
            this.dispatchEvent(new Event("change"));
        }
    }

    static get styles(): CSSResult {
        return css`
            :host {
                display: inline-block;
                min-width: 12rem;
            }
            :host::part(wrapper) {
                position: relative;
                padding: 0.1rem 1rem;
            }
            :host[aria-disabled]::part(wrapper) {
                background-color: hsla(0, 0%, 0%, 0.2);
                color: hsla(0, 0%, 25%, 1);
            }
            :host::part(wrapper)::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
            }
            :host:not([aria-disabled]):hover::part(wrapper)::after {
                background-color: hsla(0, 0%, 0%, 0.1);
            }
            :host:not([aria-disabled]):focus::part(wrapper)::after {
                background-color: hsla(0, 0%, 0%, 0.3);
            }
            :host[aria-selected="true"]::part(wrapper)::before {
                content: "️️️️️️✔️ ";
            }
        `;
    }

    render(): TemplateResult {
        return html`<div part="wrapper" role="presentation">${this.value ?? ""}</div>`;
    }
}
