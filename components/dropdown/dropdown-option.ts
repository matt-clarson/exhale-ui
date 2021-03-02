import {
    LitElement,
    html,
    customElement,
    TemplateResult,
    property,
    css,
    CSSResult,
} from "lit-element";

@customElement("ex-dropdown-option")
export class DropdownOption extends LitElement {
    @property() name?: string;
    @property() value?: string;

    connectedCallback(): void {
        super.connectedCallback();
        if (!this.isConnected) return;
        this.setAttribute("role", "option");
        if (!this.hasAttribute("id")) {
            this.setAttribute("id", `${Math.random().toString(16).slice(2)}-option-${this.value}`);
        }
    }

    static get styles(): CSSResult {
        return css`
            :host {
                display: inline-block;
                width: 100%;
            }

            div {
                position: relative;
                padding: 2px 3px;
            }

            div:hover {
                cursor: pointer;
            }

            div::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }

            div:hover::after {
                background-color: rgba(0, 0, 0, 0.2);
            }

            :host(.exhale__dropdown-option--focused) div::after {
                background-color: rgba(0, 0, 0, 0.3);
            }

            :host(.exhale__dropdown-option--focused) div:hover::after {
                background-color: rgba(0, 0, 0, 0.4);
            }
        `;
    }

    render(): TemplateResult {
        return html`<div part="wrapper">${this.name}</div>`;
    }
}
