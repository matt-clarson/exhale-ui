import {
    customElement,
    html,
    LitElement,
    property,
    queryAssignedNodes,
    TemplateResult,
} from "lit-element";
import { assignAttributes } from "../internal/utils";
import { optionSelectEvent } from "../shared";

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
        if (!ALLOWED_KEYS.includes(event.key)) return;

        const options = this.options();
        const idx = this.changeFocusedOption(options, event.key);

        if (idx === -1 || this.readonly) return;

        if (!this.forceSelect && !this.multiSelect) {
            options.forEach((option, i) =>
                option.dispatchEvent(optionSelectEvent({ selected: i === idx }))
            );
        } else if (this.forceSelect && this.multiSelect !== "true" && event.key === " ") {
            options.forEach((option, i) =>
                option.dispatchEvent(
                    optionSelectEvent({
                        selected: i === idx && option.getAttribute("aria-selected") !== "true",
                    })
                )
            );
        } else if (this.multiSelect === "true" && event.key === " ") {
            const option = options[idx];
            option.dispatchEvent(optionSelectEvent({ toggle: true }));
        }
    }

    private changeFocusedOption(options: HTMLElement[], key: string): number {
        const focusedIdx = options.findIndex(o => o === document.activeElement);
        const isDisabled = (i: number) =>
            options[i].getAttribute("aria-disabled") === "true" ||
            options[i].hasAttribute("disabled");
        let nextIdx: number;

        if (key === "ArrowDown" && focusedIdx < options.length - 1) {
            nextIdx = focusedIdx + 1;
            while (nextIdx < options.length && isDisabled(nextIdx)) {
                nextIdx += 1;
            }
        } else if (key === "ArrowUp" && focusedIdx > 0) {
            nextIdx = focusedIdx - 1;
            while (nextIdx > 0 && isDisabled(nextIdx)) {
                nextIdx -= 1;
            }
        } else if (key === "Home") {
            nextIdx = 0;
            while (nextIdx < options.length && isDisabled(nextIdx)) {
                nextIdx += 1;
            }
        } else if (key === "End") {
            nextIdx = options.length - 1;
            while (nextIdx > 0 && isDisabled(nextIdx)) {
                nextIdx -= 1;
            }
        } else nextIdx = focusedIdx;

        options[nextIdx]?.focus();
        return nextIdx;
    }

    private handleDefaultSlotChange(): void {
        const options = this.options();
        options.forEach(option =>
            option.addEventListener("click", () => {
                if (this.multiSelect) {
                    option.dispatchEvent(optionSelectEvent({ toggle: true }));
                } else {
                    options.forEach(o =>
                        o.dispatchEvent(optionSelectEvent({ selected: o === option }))
                    );
                }
            })
        );
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
