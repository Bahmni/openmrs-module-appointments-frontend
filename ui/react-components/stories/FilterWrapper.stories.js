import React from "react";
// import LocationSearch from '../components/Location/LocationSearch';
import FilterWrapper from "../components/AppointmentFilterWrapper/FilterWrapper";
import { withReactIntl } from "./util";

export default { title: "Filter Search Wrapper" };
// const locationSearch=<LocationSearch value="Enter Location" />

const InternationalizedLocation = withReactIntl(FilterWrapper, {
  Filter: "Filter Wrapper for Appointments",
});

export const basic = () => <InternationalizedLocation />;
