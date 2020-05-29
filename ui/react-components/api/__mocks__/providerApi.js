const providers = [
    {
        "display": "One Provider",
        "person": {
            "uuid": "dad23b01-9a5c-469d-a29e-785d1ab46fac",
            "display": "Provider One",
            "gender": "M",
            "age": null,
            "birthdate": null,
            "birthdateEstimated": true,
            "dead": false,
            "deathDate": null,
            "causeOfDeath": null,
            "preferredName": {
                "uuid": "12b12c77-f5b4-464e-b94c-fff592379d31",
                "display": "Unknown Provider",
                "links": [
                    {
                        "rel": "self",
                        "uri": ""
                    }
                ]
            },
            "preferredAddress": null,
            "attributes": [],
            "voided": false,
            "deathdateEstimated": false,
            "birthtime": null,
            "links": [
                {
                    "rel": "self",
                    "uri": ""
                },
                {
                    "rel": "full",
                    "uri": ""
                }
            ],
            "resourceVersion": "1.11"
        },
        "uuid": "f9badd80-ab76-11e2-9e96-0800200c9a66",
        "retired": false,
        "attributes": [{
            "attributeType": {
                "display": "Available for appointments"
            },
            "value": true,
            "voided": false
        }]
    },
    {
        "display": "Provider Two",
        "person": {
            "uuid": "70e7bad3-e1c4-4a1f-a8a5-05066f40f780",
            "display": "Provider Two",
            "gender": "M",
            "age": null,
            "birthdate": null,
            "birthdateEstimated": true,
            "dead": false,
            "deathDate": null,
            "causeOfDeath": null,
            "preferredName": {
                "uuid": "0054d19a-224f-4829-bc71-04dd505b0450",
                "display": "Eric Leaming",
                "links": [
                    {
                        "rel": "self",
                        "uri": ""
                    }
                ]
            },
            "preferredAddress": null,
            "attributes": [],
            "voided": false,
            "deathdateEstimated": false,
            "birthtime": null,
            "links": [
                {
                    "rel": "full",
                    "uri": ""
                }
            ],
            "resourceVersion": "1.11"
        },
        "uuid": "ef3643ff-b6f7-4f27-8189-16689a821a9e",
        "retired": false,
        "attributes": [
            {
                "attributeType": {
                    "display": "Available for appointments"
                },
                "value": true,
                "voided": false
            }
        ]
    },
    {
        "display": "Provider Three",
        "person": {
            "uuid": "70e7bad3-e1c4-1234-a8a5-05066f40f780",
            "display": "Provider Three",
            "gender": "M",
            "age": null,
            "birthdate": null,
            "birthdateEstimated": true,
            "dead": false,
            "deathDate": null,
            "causeOfDeath": null,
            "preferredName": {
                "uuid": "0054d19a-224f-4829-bc71-04dd505b0450",
                "display": "Eric Leaming",
                "links": [
                    {
                        "rel": "self",
                        "uri": ""
                    }
                ]
            },
            "preferredAddress": null,
            "attributes": [],
            "voided": false,
            "deathdateEstimated": false,
            "birthtime": null,
            "links": [
                {
                    "rel": "full",
                    "uri": ""
                }
            ],
            "resourceVersion": "1.11"
        },
        "uuid": "ef3643ff-12er-4f27-8189-16689a821a9e",
        "retired": false,
        "attributes": [
            {
                "attributeType": {
                    "display": "Available for appointments"
                },
                "value": true,
                "voided": false
            }
        ]
    }
];

export const getAllProviders = () => {
    return new Promise((resolve, reject) => {
        process.nextTick(() =>
            resolve(providers)
        );
    });
};
