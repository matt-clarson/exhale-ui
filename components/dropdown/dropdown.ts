import {
    LitElement,
    customElement,
    html,
    TemplateResult,
    queryAssignedNodes,
    property,
} from "lit-element";
import { DropdownBox } from "./dropdown-box";
import { DropdownChangeEvent, dropdownChangeEvent, dropdownRegisterEvent } from "./events";

@customElement("ex-dropdown")
export class Dropdown extends LitElement {
    @property({ type: Boolean }) public reflectControl = false;
    @property() public value?: string;
    @queryAssignedNodes() private _dropdownbox?: Node[];
    private get dropdownbox(): DropdownBox | undefined {
        if (!this._dropdownbox === undefined || this._dropdownbox?.length === 0) return;
        const dropdownbox$ = this._dropdownbox?.find(n => n instanceof DropdownBox);
        if (dropdownbox$ === undefined)
            throw new Error("Default child of ex-dropdown should be ex-dropdownbox");
        return dropdownbox$ as DropdownBox;
    }
    @queryAssignedNodes("control") private _controls?: HTMLElement[];
    private get control(): HTMLElement | undefined {
        return this._controls?.find(el => el instanceof HTMLElement);
    }

    private handleSlotChange(): void {
        const dropdownbox = this.dropdownbox;
        if (dropdownbox === undefined) return;
        this.control?.dispatchEvent(dropdownRegisterEvent(dropdownbox));
        this.control?.addEventListener("change", event => event.stopPropagation());
        this.control?.addEventListener(
            "ex:dropdownchange",
            this.handleControlChange.bind(this) as EventListener
        );
        dropdownbox.setAttribute("aria-labelledby", this.control?.id ?? "");
        dropdownbox.updateActiveDescendant(this.value);
        dropdownbox.onChange(option => {
            this.value = option.value;
        });
        dropdownbox.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                dropdownbox.close();
            }
        });
        const activeDescendant = dropdownbox.getActiveDescendant();
        if (activeDescendant === undefined) return;
        this.control?.dispatchEvent(dropdownChangeEvent(activeDescendant));
    }

    private handleControlChange(event: DropdownChangeEvent): void {
        if (!this.reflectControl) return;
        this.value = event.detail.value;
    }

    updated(changed: Map<string, string>): void {
        if (!changed.has("value")) return;
        this.dropdownbox?.updateActiveDescendant(this.value);
        this.control?.dispatchEvent(dropdownChangeEvent({ value: this.value }));
        this.dispatchEvent(new Event("change"));
    }

    render(): TemplateResult {
        return html`
            <slot name="control"></slot>
            <slot @slotchange=${this.handleSlotChange.bind(this)}></slot>
        `;
    }
}
