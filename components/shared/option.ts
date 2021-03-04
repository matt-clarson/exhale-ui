import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
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
        assignAttributes(this)(["role", "option"], ["tabindex", "-1"]);
    }

    render(): TemplateResult {
        console.log(this.value, this.selected ? "Selected" : "Not Selected");
        return html`<div part="wrapper" role="presentation">${this.value ?? ""}</div>`;
    }
}
