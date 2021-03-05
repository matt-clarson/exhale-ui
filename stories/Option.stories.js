import { html } from "lit-html";

export default {
    title: "Option",
    component: "ex-option",
};

const Option = ({ value = "Some Value", selected, disabled }) => {
    console.log("story value:", value);
    return html`
        <ex-option
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
