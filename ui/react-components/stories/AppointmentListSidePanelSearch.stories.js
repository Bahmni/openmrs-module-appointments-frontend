import React from "react";
import Search from "../components/AppointmentListSidePanelSearch/AppointmentListSidePanelSearch";
import { withReactIntl } from "./util";

export default { title: "AppointmentListSidePanelSearch" };

const InternaltionalizedSearch = withReactIntl(Search);
export const basic = () => <InternaltionalizedSearch />;
