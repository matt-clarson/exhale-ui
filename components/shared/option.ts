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

@customElement("ex-option")
export class Option extends LitElement {
    @property()
    public value?: string;
    @property({ attribute: "aria-selected", converter: ariaBoolConverter, reflect: true })
    public selected = false;
    @property({ attribute: "aria-disabled", converter: ariaBoolConverter, reflect: true })
    public disabled = false;

    constructor() {
        super();

        const stopOnDisabled = (event: Event) => {
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

    public focus(): void {
        if (!this.disabled) super.focus();
    }

    private handleSelectEvent(event: OptionSelectEvent): void {
        console.log(event.detail);
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
            :host[aria-disabled="true"]::part(wrapper) {
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
            :host:not([aria-disabled="true"]):hover::part(wrapper)::after {
                background-color: hsla(0, 0%, 0%, 0.1);
            }
            :host:not([aria-disabled="true"]):focus::part(wrapper)::after {
                background-color: hsla(0, 0%, 0%, 0.3);
            }
        `;
    }

    render(): TemplateResult {
        console.log(this.value, this.selected ? "Selected" : "Not Selected");
        return html`<div part="wrapper" role="presentation">
            ${this.selected ? "✔️ " : ""}${this.value ?? ""}
        </div>`;
    }
}
