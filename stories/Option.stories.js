import { html } from "lit-html";

export default {
    title: "Option",
    component: "ex-option",
    argTypes: {
        onChange: { action: "change" },
        value: { type: "string" },
    },
};

const Option = ({ value = "Some Value", selected, disabled, onChange }) => {
    return html`
        <ex-option
            @change=${onChange}
            value=${value ?? ""}
            aria-selected=${!!selected}
            ?aria-disabled=${disabled}
        ></ex-option>
    `;
};

export const SelectedOption = Option.bind({});
SelectedOption.args = { selected: true };
export const DisabledOption = Option.bind({});
DisabledOption.args = { disabled: true };
