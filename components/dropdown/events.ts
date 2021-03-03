import { DropdownBox } from "./dropdown-box";

type Option = {
    value?: string;
};

export interface DropdownChangeEvent extends Event {
    detail: Option;
}

export function dropdownChangeEvent(detail: Option): DropdownChangeEvent {
    return new CustomEvent("ex:dropdownchange", { detail });
}

export interface DropdownRegisterEvent extends Event {
    detail: {
        el$: DropdownBox;
    };
}

export function dropdownRegisterEvent(el$: DropdownBox): DropdownRegisterEvent {
    return new CustomEvent("ex:dropdownregister", { detail: { el$ } });
}
