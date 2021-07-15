import React from "react";
import AppointmentStatus from "../components/AppointmentStatus/AppointmentStatus.jsx";
import { withReactIntl } from "./util";

export default { title: "Appointment Status" };

const InternationalizedAppointmentStatus = withReactIntl(AppointmentStatus, {
  Appointment_Status: "no status selected",
});

export const basic = () => <InternationalizedAppointmentStatus />;
