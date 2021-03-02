import { DropdownBox } from "./dropdown-box";

export interface DropdownChangeEvent extends Event {
    detail: {
        value: string;
    };
}

export function dropdownChangeEvent(value: string): DropdownChangeEvent {
    return new CustomEvent("ex:dropdownchange", { detail: { value } });
}

export interface DropdownRegisterEvent extends Event {
    detail: {
        el$: DropdownBox;
    };
}

export function dropdownRegisterEvent(el$: DropdownBox): DropdownRegisterEvent {
    return new CustomEvent("ex:dropdownregister", { detail: { el$ } });
}
