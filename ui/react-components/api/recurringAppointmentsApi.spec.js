import mockAxios from "jest-mock-axios";
import {getRecurringAppointment, recurringConflictsFor, saveRecurringAppointments} from "./recurringAppointmentsApi";
import {recurringAppointmentFetchUrl, appointmentConflictsUrl, recurringAppointmentsConflictsUrl, recurringAppointmentsSaveUrl} from "../constants";

describe('Recurring Appointments Api', () => {
    let payload = {
        "appointmentRequest": {
            "patientUuid": "fda50921-d5d5-4493-8de8-6ef54c9d4481",
            "serviceUuid": "2b87edcf-39ac-4dec-94c9-713b932e847c",
            "serviceTypeUuid": "50ac6a9c-158a-4743-a6b5-a4f9c9317007",
            "startDateTime": "2019-10-11T04:30:00.000Z",
            "endDateTime": "2019-10-11T05:00:00.000Z",
            "providers": [{
                "uuid": "dae6561f-cca8-4304-9996-6eae80892d91",
                "response": "ACCEPTED",
                "comments": null
            }],
            "locationUuid": "8debb630-20e0-11e7-a53f-000c29e530d2",
            "appointmentKind": "Scheduled"
        },
        "recurringPattern": {
            "frequency": 2,
            "type": "DAY",
            "period": 3
        }
    };

    it('should save recurring appointments and get saved appointments as response', async () => {

        let mockResponse = [
            {
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
                "recurring": true
            },
            {
                "uuid": "36fdc60e-7ae5-4708-9fcc-8c98daba0ca8",
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
                "startDateTime": 1570778200000,
                "endDateTime": 1570780000000,
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
                "recurring": true
            }
        ];

        mockAxios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );

        let appointment = await saveRecurringAppointments(payload);

        expect(mockAxios.post).toHaveBeenCalledWith(recurringAppointmentsSaveUrl, payload);

        expect(appointment.data).toEqual(mockResponse);
    });

    it('should get the recurring appointment when the uuid is passed', async () => {
        let mockResponse = {
            "appointmentDefaultResponse": {
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
                }]
            },
            "recurringPattern": {
                "type": "DAY",
                "period": 2,
                "frequency": 2
            }
        };
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );
        let appointmentUuid = 'appointment-uuid';
        let appointment = await getRecurringAppointment(appointmentUuid);

        expect(mockAxios.get).toHaveBeenCalledWith(`${recurringAppointmentFetchUrl}?uuid=${appointmentUuid}`);

        expect(appointment.data).toEqual(mockResponse);
    });

  it('should get conflicting appointments for recurring appointment request', async () => {
    let mockResponse = {
      "SERVICE_UNAVAILABLE": [],
      "PATIENT_DOUBLE_BOOKING": []
    };

    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: mockResponse
      })
    );

    let appointment = await recurringConflictsFor(payload);

    expect(mockAxios.post).toHaveBeenCalledWith(recurringAppointmentsConflictsUrl, payload);

    expect(appointment.data).toEqual(mockResponse);
  });
});
