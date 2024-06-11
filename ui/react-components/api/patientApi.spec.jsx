import React from 'react';
import {getPatientsByLocation} from './patientApi.js';
import mockAxios from 'jest-mock-axios';
import {patientUrl, searchPatientUrl} from '../config';
import {getPatient} from "./patientApi";

afterEach(() => {
    mockAxios.reset();
});

describe('Patient Api', () => {
    it('should take location uuid and search query and cancel Token to return list of patients', async () =>{
        let locationUuid = "locationUuid";
        let searchQuery = "searchquery";
        let cancelToken = "CancelToken";
        let expectedParams =  {
            cancelToken: cancelToken,
            params: {
                filterOnAllIdentifiers: true,
                identifier: searchQuery,
                loginLocationUuid: locationUuid,
                q: searchQuery,
                startIndex: 0
            }
        }
        let mockResponse = {
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
                }]
        };
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );

        let patientsByLocation = await getPatientsByLocation(locationUuid, searchQuery, cancelToken);

        expect(mockAxios.get)
            .toHaveBeenCalledWith(searchPatientUrl, expectedParams);
        expect(patientsByLocation).toEqual(mockResponse.pageOfResults);
    });

    it('should take location uuid and search query and start index to return list of patients', async () => {
        let locationUuid = "locationUuid";
        let searchQuery = "searchquery";
        let startIndex = 6;
        let cancelToken = "CancelToken";
        let expectedParams =  {
            cancelToken: cancelToken,
            params: {
                filterOnAllIdentifiers: true,
                identifier: searchQuery,
                loginLocationUuid: locationUuid,
                q: searchQuery,
                startIndex: startIndex
            }
        }
        let mockResponse = {
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
                }]
        };
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );

        await getPatientsByLocation(locationUuid, searchQuery, cancelToken, startIndex);

        expect(mockAxios.get)
            .toHaveBeenCalledWith(searchPatientUrl, expectedParams);
    });

    it('should fetch patient by given uuid', async () =>{
        const uuid = "1dfff08c-141b-46df-b6a2-6b69080a5000";
        let mockResponse =
            {
                "uuid": uuid,
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
            };
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );

        let patient = await getPatient(uuid);

        expect(mockAxios.get)
            .toHaveBeenCalledWith(
                `${patientUrl}/${uuid}`);
        expect(patient).toEqual(mockResponse);
    });

});