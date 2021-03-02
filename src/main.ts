import "./main.css";

const el$ = document.createElement("simple-greeting");

// const dropdownBox$ = document.createElement("ex-dropdownbox") as DropdownBox;
// dropdownBox$.addEventListener("change", event =>
//     console.log("New Value:", (event.currentTarget as DropdownBox).value)
// );

// const data = ["BDS", "Dignitas", "Oxygen", "NRG", "SSG", "Other"].map((x, i) => ({
//     name: x,
//     value: i.toString(),
// }));
// data.unshift({ name: "-- PICK YOUR TEAM --", value: "" });

// const options$ = data.map(({ name, value }) => {
//     const option$ = document.createElement("ex-dropdown-option");
//     option$.setAttribute("name", name);
//     option$.setAttribute("value", value);
//     return option$;
// });

// const dropdownButton$ = document.createElement("ex-dropdownbutton");
// dropdownButton$.setAttribute("slot", "control");

// dropdownBox$.append(dropdownButton$);
// options$.forEach(option$ => dropdownBox$.append(option$));
// document.body.append(dropdownBox$);
// document.body.append(el$);
