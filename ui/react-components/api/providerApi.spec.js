import React from 'react';
import mockAxios from 'jest-mock-axios';
import {getAllProviders} from "./providerApi";
import {providerUrl, providerParams} from "../config";

afterEach(() => {
    mockAxios.reset();
});

describe('Provider Api', () => {
    it('should return all valid providers response', async () => {
        let mockResponse = {
            "results": [
                {
                    "display": "UNKNOWN - Unknown Provider",
                    "person": {
                        "uuid": "dad23b01-9a5c-469d-a29e-785d1ab46fac",
                        "display": "Unknown Provider",
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
                    "attributes": []
                },
                {
                    "display": "259-2 - Eric Leaming",
                    "person": {
                        "uuid": "70e7bad3-e1c4-4a1f-a8a5-05066f40f780",
                        "display": "Eric Leaming",
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
                }
            ]
        };
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );

        let allProviders = await getAllProviders();

        expect(mockAxios.get).toHaveBeenCalledWith(`${providerUrl}?${providerParams}`);
        expect(allProviders[0]).toEqual(mockResponse.results[1]);
    });

});
