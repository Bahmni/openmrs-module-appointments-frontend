import React from 'react';
import {getPatientsByLocation} from './patientApi.js';
import mockAxios from 'jest-mock-axios';
import {searchPatientUrl} from '../constants.js'

afterEach(() => {
    mockAxios.reset();
});

describe('Patient Api', () =>{
    it('should take location uuid and search query to return list of patients',() =>{
        let catchFn = jest.fn(),
            thenFn = jest.fn();
        let locationUuid = "locationUuid";
        let searchQuery = "searchquery";
        let mockResponse = {
            "config": null,
            "data":{
            "totalCount": null,
            "pageOfResults": [
                {
                    "uuid": "1dfff08c-141b-46df-b6a2-6b69080a5000",
                    "birthDate": "1982-05-05",
                    "extraIdentifiers": "{\"National ID\":\"NAT2804\"}",
                    "personId": 74,
                    "deathDate": null,
                    "identifier": "GAN203006",
                    "addressFieldValue": "",
                    "givenName": "Test",
                    "middleName": null,
                    "familyName": "Hyperthyroidism",
                    "gender": "M",
                    "dateCreated": 1493967811000,
                    "activeVisitUuid": "22c33dfa-d99f-4497-b9d8-b954db9e68ac",
                    "customAttribute": null,
                    "patientProgramAttributeValue": null,
                    "hasBeenAdmitted": false,
                    "age": "37"
                }],
        },
            "headers": null,
            "status": 200,
            "statusText": "OK"
        };
        getPatientsByLocation(locationUuid, searchQuery).then(thenFn)
            .catch(catchFn);
        expect(mockAxios.get)
            .toHaveBeenCalledWith(
                `${searchPatientUrl}?loginLocationUuid=${locationUuid}&q=${searchQuery}&startIndex=0`);
        mockAxios.mockResponse(mockResponse);
        expect(thenFn).toHaveBeenCalledWith(mockResponse);
        expect(catchFn).not.toHaveBeenCalled();
    })

    it('should take location uuid and search query and start index to return list of patients',() =>{
        let catchFn = jest.fn(),
            thenFn = jest.fn();
        let locationUuid = "locationUuid";
        let searchQuery = "searchquery";
        let startIndex=6;
        let mockResponse = {
            "config": null,
            "data":{
                "totalCount": null,
                "pageOfResults": [
                    {
                        "uuid": "1dfff08c-141b-46df-b6a2-6b69080a5000",
                        "birthDate": "1982-05-05",
                        "extraIdentifiers": "{\"National ID\":\"NAT2804\"}",
                        "personId": 74,
                        "deathDate": null,
                        "identifier": "GAN203006",
                        "addressFieldValue": "",
                        "givenName": "Test",
                        "middleName": null,
                        "familyName": "Hyperthyroidism",
                        "gender": "M",
                        "dateCreated": 1493967811000,
                        "activeVisitUuid": "22c33dfa-d99f-4497-b9d8-b954db9e68ac",
                        "customAttribute": null,
                        "patientProgramAttributeValue": null,
                        "hasBeenAdmitted": false,
                        "age": "37"
                    }],
            },
            "headers": null,
            "status": 200,
            "statusText": "OK"
        };
        getPatientsByLocation(locationUuid, searchQuery, startIndex).then(thenFn)
            .catch(catchFn);
        expect(mockAxios.get)
            .toHaveBeenCalledWith(
                `${searchPatientUrl}?loginLocationUuid=${locationUuid}&q=${searchQuery}&startIndex=${startIndex}`);
    })
});