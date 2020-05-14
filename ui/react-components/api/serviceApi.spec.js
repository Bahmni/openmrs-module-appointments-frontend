import React from 'react';
import mockAxios from 'jest-mock-axios';
import {getAllServices, getService} from "./serviceApi";
import {appointmentService, servicesDefaultUrl} from "../config";

afterEach(() => {
    mockAxios.reset();
});

describe('Service Api', () => {
    it('should return all services', async () => {
        let mockResponse = [{
            "appointmentServiceId": 1,
            "name": "Physiotherapy OPD",
            "description": null,
            "speciality": {},
            "startTime": "",
            "endTime": "",
            "maxAppointmentsLimit": null,
            "durationMins": null,
            "location": {"name": "Physiotherapy", "uuid": "8de35e75-20e0-11e7-a53f-000c29e530d2"},
            "uuid": "2b87edcf-39ac-4dec-94c9-713b932e847c",
            "color": "#00CED1",
            "creatorName": null
        }, {
            "appointmentServiceId": 2,
            "name": "Dressing",
            "description": "Dressings for orthopedic, maxillo-facial, plastic, including tissue expander",
            "speciality": {},
            "startTime": "",
            "endTime": "",
            "maxAppointmentsLimit": null,
            "durationMins": null,
            "location": {"name": "OPD", "uuid": "71361c6a-9f64-11e7-b330-000c29e530d2"},
            "uuid": "7eb76991-cc67-45c1-9cb9-93d91113673a",
            "color": "#DC143C",
            "creatorName": null
        }, {
            "appointmentServiceId": 3,
            "name": "Orthopedic Consultations",
            "description": "for the orthopedic surgeons clinics",
            "speciality": {},
            "startTime": "",
            "endTime": "",
            "maxAppointmentsLimit": null,
            "durationMins": null,
            "location": {"name": "OPD", "uuid": "71361c6a-9f64-11e7-b330-000c29e530d2"},
            "uuid": "37e713fc-4283-453b-993f-9f99dae077d1",
            "color": "#00BFFF",
            "creatorName": null
        }];
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );

        let allServices = await getAllServices();

        expect(mockAxios.get)
            .toHaveBeenCalledWith(`${servicesDefaultUrl}`);
        expect(allServices).toEqual(mockResponse);
    });

    it('should return service details when service uuid is passed', async () => {
        let mockResponse = {
            "appointmentServiceId": 2,
            "name": "Dressing",
            "description": "Dressings for orthopedic, maxillo-facial, plastic, including tissue expander",
            "speciality": {},
            "startTime": "",
            "endTime": "",
            "maxAppointmentsLimit": null,
            "durationMins": null,
            "location": {"name": "OPD", "uuid": "71361c6a-9f64-11e7-b330-000c29e530d2"},
            "uuid": "7eb76991-cc67-45c1-9cb9-93d91113673a",
            "color": "#DC143C",
            "creatorName": null,
            "weeklyAvailability": [{
                "dayOfWeek": "WEDNESDAY",
                "startTime": "08:30:00",
                "endTime": "17:00:00",
                "maxAppointmentsLimit": null,
                "uuid": "ae0ca370-ec90-4501-9fa2-1169b1d9a749"
            }],
            "serviceTypes": [{
                "duration": 15,
                "name": "Maxillo-facial dressing",
                "uuid": "74d43c99-fee1-4097-904a-e2292711b27f"
            }]
        };
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );

        let service = await getService('7eb76991-cc67-45c1-9cb9-93d91113673a');

        expect(mockAxios.get).toHaveBeenCalledWith(`${appointmentService}?uuid=7eb76991-cc67-45c1-9cb9-93d91113673a`);
        expect(service).toEqual(mockResponse);
    });
});
