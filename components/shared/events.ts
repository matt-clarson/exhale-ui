import { OptionSelect } from "./types";

type CustomEvent<T> = Event & {
    detail: T;
};
export type OptionSelectEvent = CustomEvent<OptionSelect>;

export function optionSelectEvent(detail: OptionSelect): OptionSelectEvent {
    return new CustomEvent("ex:optionselect", { detail });
}
