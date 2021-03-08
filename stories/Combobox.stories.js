import { html } from "lit-html";

export default {
    title: "Combobox",
    component: "ex-combobox",
};

const Combobox = () => html`
    <ex-combobox>
        <input slot="input" type="text" />
        <ex-listbox slot="popup">
            <ex-option value="Apple"></ex-option>
            <ex-option value="Banana"></ex-option>
            <ex-option value="Mango"></ex-option>
            <ex-option value="Pear"></ex-option>
            <ex-option value="Strawberry"></ex-option>
        </ex-listbox>
    </ex-combobox>
`;

export const simpleCombobox = Combobox.bind({});
