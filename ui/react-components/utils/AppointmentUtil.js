import {CHECKED_IN_APPOINTMENT_STATUS, SCHEDULED_APPOINTMENT_STATUS} from "../constants";

export const isAppointmentScheduledOrCheckedIn = (appointment) => {
    return appointment.status === SCHEDULED_APPOINTMENT_STATUS
        || appointment.status === CHECKED_IN_APPOINTMENT_STATUS;
};
