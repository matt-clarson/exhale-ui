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
import { OptionSelectEvent } from "./events";

/**
 * An implementation of the "option" role - https://www.w3.org/TR/2010/WD-wai-aria-20100916/roles#option.
 *
 * @fires ex:optionselect - When the `ex:optionselect` is dispatched against an option, the option will change its `selected` property (`aria-selected`) to reflect the detail of the event.
 *                          Event detail should be:
 *                          ```
 *                          {
 *                              selected?: boolean,
 *                              toggle?: boolean,
 *                          }
 *                          ```
 * @cssparts wrapper - A block wrapper around the value display.
 */
@customElement("ex-option")
export class Option extends LitElement {
    /**
     * The value of the option.
     */
    @property()
    public value?: string;
    /**
     * Indicates the selected state of the option.
     */
    @property({ attribute: "aria-selected", converter: ariaBoolConverter, reflect: true })
    public selected = false;
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
        this.addEventListener("ex:optionselect", stopOnDisabled);
        this.addEventListener(
            "ex:optionselect",
            this.handleSelectEvent.bind(this) as EventListener
        );

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

    private handleSelectEvent(event: OptionSelectEvent): void {
        if (event.detail.toggle) {
            this.selected = !this.selected;
        } else {
            this.selected = !!event.detail.selected;
        }
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
        `;
    }

    render(): TemplateResult {
        return html`<div part="wrapper" role="presentation">
            ${this.selected ? "✔️ " : ""}${this.value ?? ""}
        </div>`;
    }
}
