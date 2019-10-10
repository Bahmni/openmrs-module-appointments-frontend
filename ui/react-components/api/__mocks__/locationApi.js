const locations = {
    "results": [{
        "uuid": "8d6c993e-c2cc-11de-8d13-0010c6dffd0f",
        "display": "Unknown Location",
        "name": "Unknown Location",
        "description": null,
        "address1": null,
        "address2": null,
        "cityVillage": null,
        "stateProvince": null,
        "country": null,
        "postalCode": null,
        "latitude": null,
        "longitude": null,
        "countyDistrict": null,
        "address3": null,
        "address4": null,
        "address5": null,
        "address6": null,
        "tags": [{
            "uuid": "bb971de3-e0b0-11e7-aec6-02e6b64603ba",
            "display": "Appointment Location",
            "links": [{
                "rel": "self",
                "uri": "http://localhost:8050/openmrs/ws/rest/v1/locationtag/bb971de3-e0b0-11e7-aec6-02e6b64603ba"
            }]
        }],
        "parentLocation": null,
        "childLocations": [],
        "retired": false,
        "attributes": [],
        "address7": null,
        "address8": null,
        "address9": null,
        "address10": null,
        "address11": null,
        "address12": null,
        "address13": null,
        "address14": null,
        "address15": null,
        "links": [{
            "rel": "self",
            "uri": "http://localhost:8050/openmrs/ws/rest/v1/location/8d6c993e-c2cc-11de-8d13-0010c6dffd0f"
        }, {
            "rel": "full",
            "uri": "http://localhost:8050/openmrs/ws/rest/v1/location/8d6c993e-c2cc-11de-8d13-0010c6dffd0f?v=full"
        }],
        "resourceVersion": "2.0"
    }, {
        "uuid": "c58e12ed-3f12-11e4-adec-0800271c1b75",
        "display": "OPD-1",
        "name": "OPD-1",
        "description": null,
        "address1": null,
        "address2": null,
        "cityVillage": null,
        "stateProvince": "Chattisgarh",
        "country": null,
        "postalCode": null,
        "latitude": null,
        "longitude": null,
        "countyDistrict": "Bilaspur",
        "address3": null,
        "address4": null,
        "address5": null,
        "address6": null,
        "tags": [{
            "uuid": "475d8fa3-5572-11e6-8be9-0800270d80ce",
            "display": "Visit Location",
            "links": [{
                "rel": "self",
                "uri": "http://localhost:8050/openmrs/ws/rest/v1/locationtag/475d8fa3-5572-11e6-8be9-0800270d80ce"
            }]
        }, {
            "uuid": "b8bbf83e-645f-451f-8efe-a0db56f09676",
            "display": "Login Location",
            "links": [{
                "rel": "self",
                "uri": "http://localhost:8050/openmrs/ws/rest/v1/locationtag/b8bbf83e-645f-451f-8efe-a0db56f09676"
            }]
        }, {
            "uuid": "bb971de3-e0b0-11e7-aec6-02e6b64603ba",
            "display": "Appointment Location",
            "links": [{
                "rel": "self",
                "uri": "http://localhost:8050/openmrs/ws/rest/v1/locationtag/bb971de3-e0b0-11e7-aec6-02e6b64603ba"
            }]
        }],
        "parentLocation": null,
        "childLocations": [],
        "retired": false,
        "attributes": [{
            "uuid": "78ec2222-97c2-457d-b798-fe37c3dc7256",
            "display": "IdentifierSourceName: GAN",
            "links": [{
                "rel": "self",
                "uri": "http://localhost:8050/openmrs/ws/rest/v1/location/c58e12ed-3f12-11e4-adec-0800271c1b75/attribute/78ec2222-97c2-457d-b798-fe37c3dc7256"
            }]
        }],
        "address7": null,
        "address8": null,
        "address9": null,
        "address10": null,
        "address11": null,
        "address12": null,
        "address13": null,
        "address14": null,
        "address15": null,
        "links": [{
            "rel": "self",
            "uri": "http://localhost:8050/openmrs/ws/rest/v1/location/c58e12ed-3f12-11e4-adec-0800271c1b75"
        }, {
            "rel": "full",
            "uri": "http://localhost:8050/openmrs/ws/rest/v1/location/c58e12ed-3f12-11e4-adec-0800271c1b75?v=full"
        }],
        "resourceVersion": "2.0"
    }]
};

export const getAllByTag = () => {
    return new Promise((resolve, reject) => {
        process.nextTick(() =>
            resolve(locations.results)
        );
    });
};
