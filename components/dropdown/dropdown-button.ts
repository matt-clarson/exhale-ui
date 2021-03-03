import { LitElement, customElement, html, TemplateResult, property, query } from "lit-element";
import { DropdownChangeEvent, DropdownRegisterEvent } from "./events";

@customElement("ex-dropdownbutton")
export class DropdownButton extends LitElement {
    @property({ attribute: false }) private optionName = "Click Me";
    @query("button") private button?: HTMLButtonElement;
    private registered = false;

    constructor() {
        super();

        this.addEventListener(
            "ex:dropdownregister",
            this.handleRegister.bind(this) as EventListener
        );

        this.addEventListener(
            "ex:dropdownchange",
            this.handleDropdownChange.bind(this) as EventListener
        );
    }

    private handleRegister(event: DropdownRegisterEvent): void {
        if (this.registered) return;
        this.button?.addEventListener("click", () => {
            event.detail.el$.toggleOpen();
            event.detail.el$.focus();
        });
        this.registered = true;
    }

    private handleDropdownChange(event: DropdownChangeEvent): void {
        this.optionName = event.detail.value;
    }

    connectedCallback(): void {
        super.connectedCallback();
        if (!this.isConnected) return;
        if (!this.hasAttribute("id")) {
            this.setAttribute("id", `${Math.random().toString(16).slice(2)}-dropdown-control`);
        }
    }

    render(): TemplateResult {
        return html`<button part="button">${this.optionName}</button> `;
    }
}
