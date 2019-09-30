const hostUrl = localStorage.getItem('host') ? ("https://" + localStorage.getItem('host')) : "";
const restWestV1 = `${hostUrl}/openmrs/ws/rest/v1`;
const bahmniCore = `${restWestV1}/bahmnicore`;

export const searchPatientUrl = `${bahmniCore}/patient/search`;


