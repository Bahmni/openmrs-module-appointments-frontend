const reactConstants = JSON.parse(localStorage.getItem("reactConstants"));

export const appointmentService = reactConstants["appointmentService"];
export const searchPatientUrl = reactConstants["searchPatientUrl"];
export const servicesDefaultUrl = reactConstants["servicesDefaultUrl"];
export const providerUrl = reactConstants["providerUrl"];
export const providerParams = reactConstants["providerParams"];
export const locationUrl = reactConstants["locationUrl"];
export const specialityUrl = reactConstants["specialityUrl"];
export const appointmentSaveUrl = reactConstants["appointmentSaveUrl"];
export const appointmentsSaveUrl = reactConstants["appointmentsSaveUrl"];
export const appointmentByUuidUrl = reactConstants["appointmentByUuidUrl"];
export const recurringAppointmentFetchUrl = reactConstants["recurringAppointmentFetchUrl"];
export const recurringAppointmentsSaveUrl = reactConstants["recurringAppointmentsSaveUrl"];
export const appointmentConflictsUrl = reactConstants["appointmentConflictsUrl"];
export const recurringAppointmentsConflictsUrl = reactConstants["recurringAppointmentsConflictsUrl"];

export const i18nConfigPath = reactConstants["i18nConfigPath"];
export const BAHMNI_CONFIG_URL = reactConstants["BAHMNI_CONFIG_URL"];
export const IMPLEMENTATION_CONFIG_URL = reactConstants["IMPLEMENTATION_CONFIG_URL"];
export const locationTagName = reactConstants["locationTagName"];

export const appName = 'appointments';
export const availableForAppointments = "Available for appointments";
export const minDurationForAppointment = 30;
export const MINIMUM_CHAR_LENGTH_FOR_PATIENT_SEARCH = 3;
export const DEFAULT_MAX_APPOINTMENT_PROVIDERS = 1;
export const PROVIDER_ERROR_MESSAGE_TIME_OUT_INTERVAL = 5000;
export const SERVICE_ERROR_MESSAGE_TIME_OUT_INTERVAL = 5000;
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
export const PROVIDER_RESPONSES = {
    ACCEPTED: "ACCEPTED"
};

export const CANCEL_CONFIRMATION_MESSAGE_ADD = {
  translationKey: 'APPOINTMENT_CANCEL_CONFIRMATION_TEXT',
  defaultMessage: 'Are you sure you want to cancel adding the new appointment?This will erase everything you have filled. Nothing will be saved.'
};

export const CANCEL_CONFIRMATION_MESSAGE_EDIT = {
  translationKey: 'APPOINTMENT_CANCEL_CONFIRMATION_TEXT_EDIT',
  defaultMessage: 'Are you sure you want to cancel editing the appointment? This will not save any of the changes made.'
};

const appointmentTimeProps = {
    placeHolderTranslationKey: 'CHOOSE_TIME_PLACE_HOLDER', placeHolderDefaultMessage: 'hh:mm am/pm'
};

export const appointmentStartTimeProps = startTime => {
    return {...appointmentTimeProps, defaultValue: 'From', defaultTime: startTime, translationKey: 'APPOINTMENT_TIME_FROM_LABEL'}
};

export const appointmentEndTimeProps = endTime => {
    return {...appointmentTimeProps, defaultValue: 'To', defaultTime: endTime, translationKey: 'APPOINTMENT_TIME_TO_LABEL'}
};

