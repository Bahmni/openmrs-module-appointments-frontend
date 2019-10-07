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
export const getPatientsByLocation = (locationUuid, searchQuery, startIndex = 0) => {
    return new Promise((resolve, reject) => {
        process.nextTick(() =>
                searchQuery === 'abc'
                    ? resolve(patients) : resolve([])
        );
    });
};
