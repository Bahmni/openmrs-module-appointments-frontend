import {APPOINTMENT_STATUSES} from "../constants";

export const isAppointmentScheduledOrCheckedIn = (appointment) => {
    return appointment.status === APPOINTMENT_STATUSES.Scheduled
        || appointment.status === APPOINTMENT_STATUSES.CheckedIn
        || appointment.status === APPOINTMENT_STATUSES.Requested;
};
