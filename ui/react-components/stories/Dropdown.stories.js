import React from "react";
import Dropdown from "../components/Dropdown/Dropdown";
import { withReactIntl } from "./util";

export default { title: "Dropdown" };

const colourOptions = [
  { value: "ocean", label: "Ocean" },
  { value: "blue", label: "Blue" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
  { value: "green", label: "Green" },
  { value: "forest", label: "Forest" },
  { value: "slate", label: "Slate" },
  { value: "silver", label: "Silver" },
];

const InternationalizedDropDown = withReactIntl(Dropdown, {
  DROPDOWN_NO_OPTIONS_MESSAGE: "no option",
});

export const withPlaceholder = () => (
  <InternationalizedDropDown placeholder="Sample placeholder"></InternationalizedDropDown>
);

export const withOptions = () => (
  <InternationalizedDropDown
    placeholder="Select color"
    options={colourOptions}
  ></InternationalizedDropDown>
);
