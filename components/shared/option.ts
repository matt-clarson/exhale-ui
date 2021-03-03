import { customElement, html, LitElement, property, TemplateResult } from "lit-element";

@customElement("ex-option")
export class Option extends LitElement {
    @property()
    public value?: string;
    connectedCallback(): void {
        super.connectedCallback();
        if (!this.isConnected) return;
        this.setAttribute("role", "option");
    }

    render(): TemplateResult {
        return html`<div part="wrapper" role="presentation">${this.value ?? ""}</div>`;
    }
}
