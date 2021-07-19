import React from "react";
import LocationSearch from "../components/Location/LocationSearch";
import { withReactIntl } from "./util";

export default { title: "Location Search" };
// const locationSearch=<LocationSearch value="Enter Location" />

const InternationalizedLocation = withReactIntl(LocationSearch, {
  Location: "no Location selected",
});

export const basic = () => <InternationalizedLocation />;
