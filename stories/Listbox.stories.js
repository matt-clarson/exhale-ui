import { html } from "lit-html";

export default {
    title: "Listbox",
    component: "ex-listbox",
};

const Listbox = ({ multiSelect, forceSelect }) =>
    html`
        <ex-listbox aria-multiselectable=${multiSelect} ?forceselect=${forceSelect}>
            <ex-option value="BDS"></ex-option>
            <ex-option value="Dignitas"></ex-option>
            <ex-option value="Oxygen"></ex-option>
            <ex-option value="NRG"></ex-option>
            <ex-option value="SSG"></ex-option>
        </ex-listbox>
    `;

export const SingleSelectListbox = Listbox.bind({});
export const ForceSelectListbox = Listbox.bind({});
ForceSelectListbox.args = { forceSelect: true };
export const MultiSelectListbox = Listbox.bind({});
MultiSelectListbox.args = { multiSelect: true };
