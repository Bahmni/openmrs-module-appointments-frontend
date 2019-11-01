const reactConstants = JSON.parse(localStorage.getItem("reactConstants"));

const hostUrl = localStorage.getItem('host') ? ("https://" + localStorage.getItem('host')) : "";
const rootDir = localStorage.getItem('rootDir') || "";

const restWestV1 = `${hostUrl}${reactConstants["restWestV1"]}`;
const bahmniCore = `${restWestV1}${reactConstants["bahmniCore"]}`;

export const appointmentService = `${restWestV1}${reactConstants["appointmentService"]}`;
export const searchPatientUrl = `${bahmniCore}${reactConstants["searchPatientUrl"]}`;
export const servicesDefaultUrl = `${appointmentService}${reactConstants["servicesDefaultUrl"]}`;
export const providerUrl = `${restWestV1}${reactConstants["providerUrl"]}`;
export const providerParams = reactConstants["providerParams"];
export const availableForAppointments = reactConstants["availableForAppointments"];
export const locationUrl = `${restWestV1}${reactConstants["locationUrl"]}`;
export const specialityUrl = `${restWestV1}${reactConstants["specialityUrl"]}`;
export const appointmentsSaveUrl = `${restWestV1}${reactConstants["appointmentsSaveUrl"]}`;
export const recurringAppointmentsSaveUrl = `${restWestV1}${reactConstants["recurringAppointmentsSaveUrl"]}`;

export const appName = reactConstants["appName"];

export const customLocaleUrl = `${rootDir}${reactConstants["customLocaleUrl"]}`;
export const BAHMNI_CONFIG_URL = `${hostUrl}${reactConstants["BAHMNI_CONFIG_URL"]}`;
export const IMPLEMENTATION_CONFIG_URL = `${hostUrl}${reactConstants["IMPLEMENTATION_CONFIG_URL"]}`;
export const locationTagName = reactConstants["locationTagName"];
export const minDurationForAppointment = reactConstants["minDurationForAppointment"];
export const dayRecurrenceType = reactConstants["dayRecurrenceType"];
export const weekRecurrenceType = reactConstants["weekRecurrenceType"];
export const TODAY = reactConstants["TODAY"];
export const FROM = reactConstants["FROM"];
export const MINUTES = reactConstants["MINUTES"];

