const patients = [
    {
        "uuid": "6bb24e7e-5c04-4561-9e7a-2d2bbf8074ad",
        "birthDate": "1983-09-05",
        "extraIdentifiers": null,
        "personId": 1110,
        "deathDate": null,
        "identifier": "IQ1110",
        "addressFieldValue": "",
        "givenName": "9DEC74AB",
        "middleName": null,
        "familyName": "9DEC74B7",
        "gender": "M",
        "dateCreated": 1493827187000,
        "activeVisitUuid": null,
        "customAttribute": null,
        "patientProgramAttributeValue": null,
        "hasBeenAdmitted": false,
        "age": "36"
    }
];

const openMRSPatient = [
    {
        "uuid": "209f85aa-cbc1-4fd0-9b2d-7021f23b97dd",
        "display": "10000X - Test Patient",
        "identifiers": [{
            "uuid": "2a94b2fc-6084-4982-a9b3-ef2355b8f616",
            "display": "OpenMRS ID = 10000X"
        }],
        "person": {
            "uuid": "209f85aa-cbc1-4fd0-9b2d-7021f23b97dd",
            "display": "Test Patient",
            "gender": "F",
            "age": 33,
            "birthdate": "1987-03-12T00:00:00.000+0100"
        },
        "voided": false,
        "resourceVersion": "1.8"
    }
];

export const getPatientsByLocation = (locationUuid, searchQuery, startIndex = 0) => {
    return new Promise((resolve, reject) => {
        process.nextTick(() =>
                searchQuery === 'abc'
                    ? resolve(patients) : resolve([])
        );
    });
};

export const getPatient = (uuid) => {
    return new Promise((resolve, reject) => {
        process.nextTick(() =>
            uuid === "6bb24e7e-5c04-4561-9e7a-2d2bbf8074ad" ? resolve(openMRSPatient[0]) : resolve(undefined)
        );
    });
};
