const reactConfig = JSON.parse(localStorage.getItem("reactConstants"));

export const appointmentService = reactConfig["appointmentService"];
export const searchPatientUrl = reactConfig["searchPatientUrl"];
export const servicesDefaultUrl = reactConfig["servicesDefaultUrl"];
export const providerUrl = reactConfig["providerUrl"];
export const providerParams = reactConfig["providerParams"];
export const locationUrl = reactConfig["locationUrl"];
export const specialityUrl = reactConfig["specialityUrl"];
export const appointmentSaveUrl = reactConfig["appointmentSaveUrl"];
export const appointmentsSaveUrl = reactConfig["appointmentsSaveUrl"];
export const appointmentByUuidUrl = reactConfig["appointmentByUuidUrl"];
export const recurringAppointmentFetchUrl = reactConfig["recurringAppointmentFetchUrl"];
export const recurringAppointmentsSaveUrl = reactConfig["recurringAppointmentsSaveUrl"];
export const appointmentConflictsUrl = reactConfig["appointmentConflictsUrl"];
export const recurringAppointmentsConflictsUrl = reactConfig["recurringAppointmentsConflictsUrl"];

export const i18nConfigPath = reactConfig["i18nConfigPath"];
export const BAHMNI_CONFIG_URL = reactConfig["BAHMNI_CONFIG_URL"];
export const IMPLEMENTATION_CONFIG_URL = reactConfig["IMPLEMENTATION_CONFIG_URL"];
export const locationTagName = reactConfig["locationTagName"];