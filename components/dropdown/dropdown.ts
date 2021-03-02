import {
    LitElement,
    customElement,
    html,
    TemplateResult,
    queryAssignedNodes,
    property,
} from "lit-element";
import { DropdownBox } from "./dropdown-box";
import { DropdownOption } from "./dropdown-option";
import { dropdownChangeEvent, dropdownRegisterEvent } from "./events";

@customElement("ex-dropdown")
export class Dropdown extends LitElement {
    // properties
    @property() public value = "";

    // assigned nodes
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

    handleSlotChange(): void {
        const dropdownbox = this.dropdownbox;
        if (dropdownbox === undefined) return;
        this.control?.dispatchEvent(dropdownRegisterEvent(dropdownbox));
        this.control?.addEventListener("change", event => event.stopPropagation());
        dropdownbox.setAttribute("aria-labelledby", this.control?.id ?? "");
        dropdownbox.updateActiveDescendant(this.value);
        dropdownbox.onChange(this.onOptionChange.bind(this));
        dropdownbox.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                dropdownbox.close();
            }
        });
        const activeDescendant = dropdownbox.getActiveDescendant();
        if (activeDescendant?.name === undefined) return;
        this.control?.dispatchEvent(dropdownChangeEvent(activeDescendant.name));
    }

    onOptionChange(option: DropdownOption): void {
        if (option.name === undefined || option.value === undefined) return;
        this.value = option.value;
        this.dropdownbox?.updateActiveDescendant(option.value);
        this.control?.dispatchEvent(dropdownChangeEvent(option.name));
        this.dispatchEvent(new Event("change"));
    }

    // render
    render(): TemplateResult {
        return html`
            <slot name="control"></slot>
            <slot @slotchange=${this.handleSlotChange.bind(this)}></slot>
        `;
    }
}
