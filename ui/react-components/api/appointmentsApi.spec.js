import mockAxios from "jest-mock-axios";
import {appointmentConflictsUrl, appointmentByUuidUrl, appointmentSaveUrl, appointmentSummaryUrl, searchAppointmentsUrl} from "../config";
import {
    getAppointment,
    conflictsFor,
    saveOrUpdateAppointment,
    getAppointmentSummary,
    searchAppointments
} from "./appointmentsApi";

describe('Appointments Api', () => {

    afterEach(() => {
        mockAxios.reset();
    });

    const payload = {
        "patientUuid": "fda50921-d5d5-4493-8de8-6ef54c9d4481",
        "serviceUuid": "2b87edcf-39ac-4dec-94c9-713b932e847c",
        "serviceTypeUuid": "50ac6a9c-158a-4743-a6b5-a4f9c9317007",
        "startDateTime": "2019-10-11T04:30:00.000Z",
        "endDateTime": "2019-10-11T05:00:00.000Z",
        "providers": [{"uuid": "dae6561f-cca8-4304-9996-6eae80892d91", "response": "ACCEPTED", "comments": null}],
        "locationUuid": "8debb630-20e0-11e7-a53f-000c29e530d2",
        "appointmentKind": "Scheduled"
    };

    it('should save appointment and get saved appointment as response', async () => {
        let mockResponse = {
            "uuid": "36fdc60e-7ae5-4708-9fcc-8c98daba0ca9",
            "appointmentNumber": "0000",
            "patient": {
                "identifier": "IQ1114",
                "name": "9DEC81BF 9DEC81C6",
                "uuid": "fda50921-d5d5-4493-8de8-6ef54c9d4481"
            },
            "service": {
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
            },
            "serviceType": {"duration": 30, "name": "1 session", "uuid": "50ac6a9c-158a-4743-a6b5-a4f9c9317007"},
            "provider": null,
            "location": {"name": "Operating Theatre", "uuid": "8debb630-20e0-11e7-a53f-000c29e530d2"},
            "startDateTime": 1570768200000,
            "endDateTime": 1570770000000,
            "appointmentKind": "Scheduled",
            "status": "Scheduled",
            "comments": null,
            "additionalInfo": {},
            "providers": [{
                "uuid": "dae6561f-cca8-4304-9996-6eae80892d91",
                "comments": null,
                "response": "ACCEPTED",
                "name": "Abeer Abusamour"
            }],
            "recurring": false
        };

        mockAxios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );
        let appointment = await saveOrUpdateAppointment(payload);

        expect(mockAxios.post).toHaveBeenCalledWith(appointmentSaveUrl, payload);

        expect(appointment.data).toEqual(mockResponse);
    });

    it('should get the appointment when the uuid is passed', async () => {
        let mockResponse = {
            "uuid": "appointment-uuid",
            "appointmentNumber": "0000",
            "patient": {
                "identifier": "IQ1114",
                "name": "9DEC81BF 9DEC81C6",
                "uuid": "fda50921-d5d5-4493-8de8-6ef54c9d4481"
            },
            "service": {
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
            },
            "serviceType": {"duration": 30, "name": "1 session", "uuid": "50ac6a9c-158a-4743-a6b5-a4f9c9317007"},
            "provider": null,
            "location": {"name": "Operating Theatre", "uuid": "8debb630-20e0-11e7-a53f-000c29e530d2"},
            "startDateTime": 1570768200000,
            "endDateTime": 1570770000000,
            "appointmentKind": "Scheduled",
            "status": "Scheduled",
            "comments": null,
            "additionalInfo": {},
            "providers": [{
                "uuid": "dae6561f-cca8-4304-9996-6eae80892d91",
                "comments": null,
                "response": "ACCEPTED",
                "name": "Abeer Abusamour"
            }],
            "recurring": false
        };
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );
        let appointmentUuid = 'appointment-uuid';
        let appointment = await getAppointment(appointmentUuid);

        expect(mockAxios.get).toHaveBeenCalledWith(`${appointmentByUuidUrl}?uuid=${appointmentUuid}`);

        expect(appointment.data).toEqual(mockResponse);
    });

    it('should get conflict appointment as response', async () => {
    let mockResponse = {
      "SERVICE_UNAVAILABLE": [],
      "PATIENT_DOUBLE_BOOKING": []
    };

    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: mockResponse
      })
    );

    let appointment = await conflictsFor(payload);

    expect(mockAxios.post).toHaveBeenCalledWith(appointmentConflictsUrl, payload);

    expect(appointment.data).toEqual(mockResponse);
  });
    
    it('should update the appointment with the given data', async () => {
        let mockResponse = {
            "uuid": "36fdc60e-7ae5-4708-9fcc-8c98daba0ca9",
            "appointmentNumber": "0000",
            "patient": {
                "identifier": "IQ1114",
                "name": "9DEC81BF 9DEC81C6",
                "uuid": "fda50921-d5d5-4493-8de8-6ef54c9d4481"
            },
            "service": {
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
            },
            "serviceType": {"duration": 30, "name": "1 session", "uuid": "50ac6a9c-158a-4743-a6b5-a4f9c9317007"},
            "provider": null,
            "location": {"name": "Operating Theatre", "uuid": "8debb630-20e0-11e7-a53f-000c29e530d2"},
            "startDateTime": 1570768200000,
            "endDateTime": 1570770000000,
            "appointmentKind": "Scheduled",
            "status": "Scheduled",
            "comments": null,
            "additionalInfo": {},
            "providers": [{
                "uuid": "dae6561f-cca8-4304-9996-6eae80892d91",
                "comments": null,
                "response": "ACCEPTED",
                "name": "Abeer Abusamour"
            }],
            "recurring": false
        };
        mockAxios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );
        payload.uuid = "36fdc60e-7ae5-4708-9fcc-8c98daba0ca9";
        let appointment = await saveOrUpdateAppointment(payload);

        expect(mockAxios.post).toHaveBeenCalledWith(appointmentSaveUrl, payload);

        expect(appointment.data).toEqual(mockResponse);
    });

    it('should get appointment summary as response', async () => {
        let mockResponse = [
            {
                "appointmentService": {
                    "appointmentServiceId": 1,
                    "name": "Cardiology",
                    "description": null,
                    "speciality": {
                        "name": "Cardiology",
                        "uuid": "10a45eb9-e0b1-11e7-aec6-02e6b64603ba"
                    },
                    "startTime": "",
                    "endTime": "",
                    "maxAppointmentsLimit": null,
                    "durationMins": null,
                    "location": {},
                    "uuid": "7b200662-e21a-488c-8274-4eff81117608",
                    "color": "#006400",
                    "initialAppointmentStatus": null,
                    "creatorName": null
                },
                "appointmentCountMap": {
                    "2023-04-24": {
                        "allAppointmentsCount": 1,
                        "missedAppointmentsCount": 0,
                        "appointmentDate": 1682274600000,
                        "appointmentServiceUuid": "7b200662-e21a-488c-8274-4eff81117608"
                    }
                }
            }
            ]

        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );
        const startDate = '2023-04-23T18:30:00.000Z';
        const endDate = '2023-04-30T18:29:59.999Z';

        let appointmentSummary = await getAppointmentSummary(startDate, endDate);

        expect(mockAxios.get).toHaveBeenCalledWith(`${appointmentSummaryUrl}?endDate=${endDate}&startDate=${startDate}`);

        expect(appointmentSummary.data).toEqual(mockResponse);
    });

    it('should return all appointments as response', async () => {
        let mockResponse = [{
            "uuid": "695dfd06-8ffb-4c7a-a535-83202f5b0668",
            "appointmentNumber": "0000",
            "patient": {
                "identifier": "ABC200000",
                "gender": "M",
                "name": "Abc A B",
                "uuid": "22dbd669-d0ff-424c-b1fc-12013b5655f4",
                "age": 23,
                "PatientIdentifier": "ABC200000"
            },
            "service": {
                "appointmentServiceId": 5,
                "name": "ENT Follow-up Consultation",
                "description": "Appointment for ENT Follow-up",
                "speciality": {
                    "name": "ENT",
                    "uuid": "8c988914-8f98-4333-ae51-4da92f5cad27"
                },
                "startTime": "",
                "endTime": "",
                "maxAppointmentsLimit": null,
                "durationMins": 15,
                "location": {},
                "uuid": "389012ba-8471-4f73-88a0-fbc742448f11",
                "color": null,
                "initialAppointmentStatus": null,
                "creatorName": null
            },
            "serviceType": null,
            "provider": null,
            "location": null,
            "startDateTime": 1682322300000,
            "endDateTime": 1682323200000,
            "appointmentKind": "Scheduled",
            "status": "Scheduled",
            "comments": null,
            "additionalInfo": null,
            "teleconsultation": null,
            "providers": [
                {
                    "uuid": "9cd23277-cf8c-11ed-8f48-0242ac13000d",
                    "comments": null,
                    "response": "ACCEPTED",
                    "name": "Super Man"
                }
            ],
            "voided": false,
            "extensions": {
                "patientEmailDefined": false
            },
            "teleconsultationLink": null,
            "recurring": false
        }]

        mockAxios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );
        const startDate = '2023-04-23T18:30:00.000Z';
        const endDate = '2023-04-30T18:29:59.999Z';

        let appointmentSummary = await searchAppointments({startDate, endDate});

        expect(mockAxios.post).toHaveBeenCalledWith(searchAppointmentsUrl, { startDate, endDate });

        expect(appointmentSummary.data).toEqual(mockResponse);
    });
});
