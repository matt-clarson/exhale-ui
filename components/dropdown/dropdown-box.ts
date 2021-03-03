import {
    LitElement,
    customElement,
    queryAssignedNodes,
    html,
    TemplateResult,
    property,
    css,
    CSSResult,
} from "lit-element";
import { styleMap } from "lit-html/directives/style-map";
import { DropdownOption } from "./dropdown-option";

@customElement("ex-dropdownbox")
export class DropdownBox extends LitElement {
    private onChangeHandler?: (option: DropdownOption) => void;

    @property({ attribute: false }) private isOpen = false;
    @queryAssignedNodes() private _options?: Node[];
    private get options(): DropdownOption[] {
        const options = this._options?.filter(o => o instanceof DropdownOption) ?? [];
        return options as DropdownOption[];
    }

    constructor() {
        super();
        this.addEventListener("keydown", this.handleKeyPress.bind(this));
        this.addEventListener("blur", () => void (this.isOpen = false));
    }

    public toggleOpen(): void {
        this.isOpen = !this.isOpen;
    }

    public close(): void {
        this.isOpen = false;
    }

    public getActiveDescendant(): DropdownOption | undefined {
        return this.options.find(option => option.hasAttribute("aria-selected"));
    }

    public updateActiveDescendant(value: string): void {
        for (const option of this.options) {
            if (option.value === value) {
                this.setAttribute("aria-activedescendant", option.id);
                option.classList.add("exhale__dropdown-option--focused");
                option.setAttribute("aria-selected", "true");
            } else {
                option.classList.remove("exhale__dropdown-option--focused");
                option.removeAttribute("aria-selected");
            }
        }
    }

    public onChange(handler: (option: DropdownOption) => void): void {
        this.onChangeHandler = handler;
    }

    private handleSlotChange(): void {
        this.options.forEach(option => {
            console.log(option);
            option.addEventListener("click", () => {
                console.log("clicked on:", option);
                this.onChangeHandler?.(option);
            });
        });
    }

    private handleKeyPress(event: KeyboardEvent): void {
        if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
        const optionIdx = this.options.findIndex(option => option.hasAttribute("aria-selected"));
        let nextIdx;
        if (event.key === "ArrowUp") {
            nextIdx = optionIdx - 1;
        } else {
            nextIdx = optionIdx + 1;
        }
        this.onChangeHandler?.(this.options[nextIdx]);
    }

    static get styles(): CSSResult {
        return css`
            :host {
                display: block;
                width: min-content;
                outline: none !important;
            }
            div {
                padding: 0;
                margin: 0;
                border: 1px solid hsl(0, 0%, 15%);
                flex-flow: column nowrap;
            }
        `;
    }

    get styles(): Record<string, string> {
        return {
            display: this.isOpen ? "flex" : "none",
            width: this.isOpen ? "300px" : "0px",
        };
    }

    connectedCallback(): void {
        super.connectedCallback();
        if (!this.isConnected) return;
        this.setAttribute("role", "listbox");
        this.setAttribute("tabindex", "-1");
    }

    render(): TemplateResult {
        return html`
            <div part="wrapper" style=${styleMap(this.styles)}>
                <slot @slotchange=${this.handleSlotChange}></slot>
            </div>
        `;
    }
}
