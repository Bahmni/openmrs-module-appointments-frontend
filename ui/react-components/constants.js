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
export const dayRecurrenceType = "DAY";
export const weekRecurrenceType = "WEEK";
export const TODAY = "TODAY";
export const FROM = "FROM";
export const MINUTES = "minutes";

