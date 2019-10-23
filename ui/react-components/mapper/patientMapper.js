export const getPatientName = (patient) => {
    const givenName = patient.givenName ? patient.givenName : '';
    const familyName = patient.familyName ? patient.familyName : '';
    return givenName ? familyName ? `${givenName} ${familyName}` : `${givenName}` : `${familyName}`;
};