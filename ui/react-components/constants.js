const hostUrl = localStorage.getItem('host') ? ("https://" + localStorage.getItem('host')) : "";
const restWestV1 = `${hostUrl}/openmrs/ws/rest/v1`;
const bahmniCore = `${restWestV1}/bahmnicore`;

export const appointmentService = `${restWestV1}/appointmentService`;
export const searchPatientUrl = `${bahmniCore}/search/patient`;
export const servicesDefaultUrl = `${appointmentService}/all/default`;
export const providerUrl = `${restWestV1}/provider`;
export const providerParams = `v=custom:(display,person,uuid,retired,attributes:(attributeType:(display),value,voided))`;
export const availableForAppointments = "Available for appointments";
export const locationUrl = `${restWestV1}/location`;
export const specialityUrl = `${restWestV1}/speciality/all`;
export const appointmentsSaveUrl = `${restWestV1}/appointments`;
export const appointmentSaveUrl = `${restWestV1}/appointment`;
export const appointmentByUuidUrl = `${restWestV1}/appointment/`;
export const recurringAppointmentFetchUrl = `${restWestV1}/recurring-appointments/`;
export const recurringAppointmentsSaveUrl = `${restWestV1}/recurring-appointments`;
export const appointmentConflictsUrl = `${appointmentsSaveUrl}/conflicts`;
export const recurringAppointmentsConflictsUrl = `${recurringAppointmentsSaveUrl}/conflicts`;

export const appName = 'appointments';

export const BAHMNI_CONFIG_URL = `${hostUrl}/bahmni_config/openmrs/apps`;
export const IMPLEMENTATION_CONFIG_URL = `${hostUrl}/implementation_config/openmrs/apps`;
export const locationTagName = 'Appointment Location';
export const minDurationForAppointment = 30;
export const MINIMUM_CHAR_LENGTH_FOR_PATIENT_SEARCH = 3;
export const dayRecurrenceType = "DAY";
export const weekRecurrenceType = "WEEK";
export const TODAY = "TODAY";
export const FROM = "FROM";
export const MINUTES = "minutes";

export const RECURRING_APPOINTMENT_TYPE = "Recurring";
export const WALK_IN_APPOINTMENT_TYPE = "WalkIn";
export const SCHEDULED_APPOINTMENT_TYPE = "Scheduled";

export const SCHEDULED_APPOINTMENT_STATUS = "Scheduled";
export const CHECKED_IN_APPOINTMENT_STATUS = "CheckedIn";

export const RECURRENCE_TERMINATION_AFTER = "After";
export const RECURRENCE_TERMINATION_ON = "On";

export const CANCEL_CONFIRMATION_MESSAGE_ADD = {
  translationKey: 'APPOINTMENT_CANCEL_CONFIRMATION_TEXT',
  defaultMessage: 'Are you sure you want to cancel adding the new appointment?This will erase everything you have filled. Nothing will be saved.'
};

export const CANCEL_CONFIRMATION_MESSAGE_EDIT = {
  translationKey: 'APPOINTMENT_CANCEL_CONFIRMATION_TEXT_EDIT',
  defaultMessage: 'Are you sure you want to cancel editing the appointment? This will not save any of the changes made.'
};

const appointmentTimeProps = {
    translationKey: 'APPOINTMENT_TIME_FROM_LABEL',
    placeHolderTranslationKey: 'CHOOSE_TIME_PLACE_HOLDER', placeHolderDefaultMessage: 'hh:mm am/pm'
};

export const appointmentStartTimeProps = startTime => {
    return {...appointmentTimeProps, defaultValue: 'From', defaultTime: startTime}
};

export const appointmentEndTimeProps = endTime => {
    return {...appointmentTimeProps, defaultValue: 'To', defaultTime: endTime}
};

