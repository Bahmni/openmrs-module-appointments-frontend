import {isAppointmentScheduledOrCheckedIn, isPastAppointment} from "../../utils/AppointmentUtil";

export const getComponentsDisableStatus = (appointment, isServiceOnAppointmentEditable) => {
    const componentDisableStatus = {
        patient: false,
        speciality: false,
        service: false
    };

    const scheduledOrCheckedInAppointment = isAppointmentScheduledOrCheckedIn(appointment);
    componentDisableStatus.patient = true;
    componentDisableStatus.service = !(scheduledOrCheckedInAppointment && isServiceOnAppointmentEditable);
    componentDisableStatus.speciality = componentDisableStatus.service;
    return componentDisableStatus;
};
