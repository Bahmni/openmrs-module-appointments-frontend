import React from "react";
import AppSpecialityFilter from "../components/AppSpecialityFilter/AppSpecialityFilter";
export default { title: "AppSpecilaityFilter" };
import { withReactIntl } from "./util";
const nodes = [
  {
    value: "Physiotherapy OPD",
    label: "Physiotherapy OPD",
    children: [
      { value: "1 session [30 min]", label: "1 session [30 min]" },
      { value: "POP [30 min]", label: "POP [30 min]" },
    ],
  },
];
const InternationalizedAppSpecialityFilter = withReactIntl(AppSpecialityFilter);
export const basic = () => (
  <InternationalizedAppSpecialityFilter nodes={nodes} />
);
