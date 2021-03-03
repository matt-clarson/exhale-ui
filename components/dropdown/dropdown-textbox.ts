import { customElement, html, LitElement, property, query, TemplateResult } from "lit-element";
import { dropdownChangeEvent, DropdownChangeEvent, DropdownRegisterEvent } from "./events";

@customElement("ex-dropdown-textbox")
export class DropdownTextbox extends LitElement {
    @property() public placeholder = "-- PICK FROM LIST --";
    @property({ attribute: false }) private value?: string;
    @property() public label = "Make Selection";
    @query("input") private input$?: HTMLInputElement;
    private inputId = `${Math.random().toString(16).slice(2)}-control__input`;

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
        const dropdownbox = event.detail.el$;
        this.input$?.addEventListener("focus", () => {
            dropdownbox.open();
        });
        this.input$?.addEventListener("blur", event => {
            if (event.relatedTarget !== dropdownbox) dropdownbox.close();
        });
        this.input$?.addEventListener("keydown", event => {
            if (event.key === "ArrowDown") dropdownbox.focus();
        });
        this.registered = true;
    }

    private handleDropdownChange(event: DropdownChangeEvent): void {
        if (event.detail.value === this.value) return;
        this.value = event.detail.value;
    }

    private handleChange(event: InputEvent): void {
        const input = event.currentTarget as HTMLInputElement;
        this.dispatchEvent(dropdownChangeEvent({ value: input.value }));
    }

    connectedCallback(): void {
        super.connectedCallback();
        if (!this.isConnected) return;
        if (!this.hasAttribute("id")) {
            this.setAttribute("id", `${Math.random().toString(16).slice(2)}-control`);
        }
    }

    render(): TemplateResult {
        return html`
            <label part="label" for=${this.inputId}>${this.label}</label>
            <input
                id=${this.inputId}
                part="input"
                value=${this.value ?? ""}
                placeholder=${this.placeholder}
                @input=${this.handleChange.bind(this)}
                @change=${this.handleChange.bind(this)}
            />
        `;
    }
}
