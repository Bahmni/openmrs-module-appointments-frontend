export const getPatientName = (patient) => {
    const givenName = patient.givenName ? patient.givenName : '';
    const familyName = patient.familyName ? patient.familyName : '';
    return givenName && familyName ? `${givenName} ${familyName}` : `${givenName}` || `${familyName}`;
};

export const getPatientForDropdown = patient => {
    const {identifier, uuid} = patient;
    const name = patient.name || getPatientName(patient);
    return {
        value: {name, identifier, uuid},
        label: `${name} (${patient.identifier})`};
};
