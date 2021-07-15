import React from "react";
import Tags from "../components/Tags/Tags";

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

export default { title: "Tag" };

export const basic = () => <Tags selectedTags={colourOptions} />;
