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

enum DropdownKey {
    UP,
    DOWN,
}

@customElement("ex-dropdownbox")
export class DropdownBox extends LitElement {
    private onChangeHandler?: (option: DropdownOption) => void;

    @property({ attribute: false }) private isOpen = false;
    public toggleOpen(): void {
        this.isOpen = !this.isOpen;
    }

    public close(): void {
        this.isOpen = false;
    }

    constructor() {
        super();
        this.addEventListener("keydown", this.handleKeyPress.bind(this));
        this.addEventListener("blur", () => void (this.isOpen = false));
    }

    connectedCallback(): void {
        super.connectedCallback();
        if (!this.isConnected) return;
        this.setAttribute("role", "listbox");
        this.setAttribute("tabindex", "-1");
    }

    @queryAssignedNodes() private options?: NodeListOf<Node>;

    public getOptions(): DropdownOption[] {
        return Array.from(this.options ?? []).filter(
            option => option instanceof DropdownOption
        ) as DropdownOption[];
    }

    public getActiveDescendant(): DropdownOption | undefined {
        return this.getOptions().find(option => option.hasAttribute("aria-selected"));
    }

    public updateActiveDescendant(value: string): void {
        for (const option of this.getOptions()) {
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

    handleSlotChange(): void {
        this.getOptions().forEach(option => {
            console.log(option);
            option.addEventListener("click", () => {
                console.log("clicked on:", option);
                this.onChangeHandler?.(option);
            });
        });
    }

    handleKeyPress(event: KeyboardEvent): void {
        if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
        const options = this.getOptions();
        const optionIdx = options.findIndex(option => option.hasAttribute("aria-selected"));
        let nextIdx;
        if (event.key === "ArrowUp") {
            nextIdx = optionIdx - 1;
        } else {
            nextIdx = optionIdx + 1;
        }
        this.onChangeHandler?.(options[nextIdx]);
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

    render(): TemplateResult {
        return html`
            <div part="wrapper" style=${styleMap(this.styles)}>
                <slot @slotchange=${this.handleSlotChange}></slot>
            </div>
        `;
    }
}
