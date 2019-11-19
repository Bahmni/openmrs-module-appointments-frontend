import {isAppointmentScheduledOrCheckedIn} from "../../utils/AppointmentUtil";

export const getComponentsDisableStatus = (appointment, isServiceOnAppointmentEditable) => {
    const componentDisableStatus = {
        patient: false,
        speciality: false,
        service: false,
        serviceType: false,
        providers: false,
        location: false,
        startDate: false,
        time: false,
        occurrences: false,
        endDate: false
    };

    const scheduledOrCheckedInAppointment = isAppointmentScheduledOrCheckedIn(appointment);
    componentDisableStatus.patient = true;
    componentDisableStatus.service = !(scheduledOrCheckedInAppointment && isServiceOnAppointmentEditable);
    componentDisableStatus.speciality = componentDisableStatus.service;
    componentDisableStatus.serviceType = !scheduledOrCheckedInAppointment;
    componentDisableStatus.providers = !scheduledOrCheckedInAppointment;
    componentDisableStatus.location = !scheduledOrCheckedInAppointment;
    componentDisableStatus.startDate = !scheduledOrCheckedInAppointment;
    componentDisableStatus.time = !scheduledOrCheckedInAppointment;
    componentDisableStatus.occurrences = !scheduledOrCheckedInAppointment;
    componentDisableStatus.endDate = !scheduledOrCheckedInAppointment;
    return componentDisableStatus;
};
