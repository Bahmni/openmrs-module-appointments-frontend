import React from "react";
import GridSummary from "../components/GridSummary/GridSummary";
import dummyData from "../components/GridSummary/AppointSummary.json";
import { withReactIntl } from "./util";

export default { title: "GridSummary" };

const InternationalizedGridSummary = withReactIntl(GridSummary);

export const withPlaceholder = () => (
  <InternationalizedGridSummary
    gridData={dummyData}
    weekStartDate="2020-04-06"
    onClick={(date) => alert(date)}
  />
);
