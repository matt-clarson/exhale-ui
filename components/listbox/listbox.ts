import {
    customElement,
    html,
    LitElement,
    property,
    queryAssignedNodes,
    TemplateResult,
} from "lit-element";
import { assignAttributes, forceAttribute } from "../internal/utils";
import { EX_OPTION_FOCUSED } from "../shared/constants";

const ALLOWED_KEYS = ["ArrowUp", "ArrowDown", "Home", "End", " "];

@customElement("ex-listbox")
export class Listbox extends LitElement {
    @property()
    public value?: string;
    @queryAssignedNodes()
    private defaultSlotted?: Node[];
    @property({ type: Boolean })
    public forceSelect = false;
    @property({ attribute: "aria-multiselectable" })
    public multiSelect?: string;
    @property({ attribute: "aria-readonly", type: Boolean })
    public readonly = false;

    constructor() {
        super();
        this.onkeydown = this.handleKeyDown.bind(this);
    }

    private options(): HTMLElement[] {
        return (this.defaultSlotted?.filter(n => n instanceof HTMLElement) ?? []) as HTMLElement[];
    }

    private handleKeyDown(event: KeyboardEvent): void {
        console.log(event.key);
        if (!ALLOWED_KEYS.includes(event.key)) return;

        const options = this.options();
        const idx = this.changeFocusedOption(options, event.key);

        if (idx === -1 || this.readonly) return;

        if (!this.forceSelect && !this.multiSelect) {
            options.forEach((option, i) =>
                forceAttribute(option, ["aria-selected", i === idx ? "true" : null])
            );
        } else if (this.forceSelect && this.multiSelect !== "true" && event.key === " ") {
            options.forEach((option, i) =>
                forceAttribute(option, [
                    "aria-selected",
                    i === idx && option.getAttribute("aria-selected") !== "true" ? "true" : null,
                ])
            );
        } else if (this.multiSelect === "true" && event.key === " ") {
            const option = options[idx];
            forceAttribute(option, [
                "aria-selected",
                option.getAttribute("aria-selected") === "true" ? "false" : "true",
            ]);
        }
    }

    private changeFocusedOption(options: HTMLElement[], key: string): number {
        const focusedIdx = options.findIndex(o => o.classList.contains(EX_OPTION_FOCUSED));
        let nextIdx: number;

        if (key === "ArrowDown" && focusedIdx < options.length - 1) nextIdx = focusedIdx + 1;
        else if (key === "ArrowUp" && focusedIdx > 0) nextIdx = focusedIdx - 1;
        else if (key === "Home") nextIdx = 0;
        else if (key === "End") nextIdx = options.length - 1;
        else nextIdx = focusedIdx;

        options[focusedIdx]?.classList.remove(EX_OPTION_FOCUSED);
        options[nextIdx]?.classList.add(EX_OPTION_FOCUSED);
        return nextIdx;
    }

    private handleDefaultSlotChange(): void {
        if (this.multiSelect === "true") {
            this.options().forEach(option =>
                forceAttribute(option, [
                    "aria-selected",
                    option.getAttribute("aria-selected") === "true" ? "true" : "false",
                ])
            );
        }
    }

    connectedCallback(): void {
        super.connectedCallback();
        if (!this.isConnected) return;
        assignAttributes(this)(["role", "listbox"], ["tabindex", "0"]);
    }

    render(): TemplateResult {
        return html`<slot @slotchange=${this.handleDefaultSlotChange.bind(this)}></slot>`;
    }
}
