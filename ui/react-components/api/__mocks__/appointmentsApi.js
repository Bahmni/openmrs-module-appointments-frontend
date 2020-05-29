import {find} from 'lodash';

const appointmentResponses = [
    {
        "data": {
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
                "speciality": {name: 'test speciality', uuid: '8de35e75-20e0-11e7-a53f-5usc29e530d2'},
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
            "startDateTime": 253400569200000,
            "endDateTime": 253400571000000,
            "appointmentKind": "Scheduled",
            "status": "Scheduled",
            "comments": "comments",
            "additionalInfo": {},
            "providers": [{
                "uuid": "dae6561f-cca8-4304-9996-6eae80892d91",
                "comments": null,
                "response": "ACCEPTED",
                "name": "Abeer Abusamour"
            }, {
                "uuid": "ef3643ff-b6f7-4f27-8189-16689a821a9e",
                "comments": null,
                "response": "CANCELLED",
                "name": "Provider Two"
            }],
            "recurring": false
        }
    },
    {
        "data": {
            "uuid": "123tr5-7ae5-4708-9fcc-8c98daba0ca9",
            "appointmentNumber": "0001",
            "patient": {
                "identifier": "IQ1114",
                "name": "9DEC81BF 9DEC81C6",
                "uuid": "fda50921-d5d5-4493-8de8-6ef54c9d4481"
            },
            "service": {
                "appointmentServiceId": 1,
                "name": "Ortho Requested",
                "description": null,
                "speciality": {name: 'test speciality', uuid: '8de35e75-20e0-11e7-a53f-5usc29e530d2'},
                "startTime": "",
                "endTime": "",
                "maxAppointmentsLimit": null,
                "durationMins": null,
                "location": {"name": "Physiotherapy", "uuid": "8de35e75-20e0-11e7-a53f-000c29e530d2"},
                "uuid": "7eb76991-cc67-45c1-9cb9-93d91113672b",
                "color": "#00CED1",
                "initialAppointmentStatus": "Requested",
                "creatorName": null
            },
            "serviceType": {"duration": 30, "name": "1 session", "uuid": "50ac6a9c-158a-4743-a6b5-a4f9c9317007"},
            "startDateTime": 253400569200000,
            "endDateTime": 253400571000000,
            "appointmentKind": "Scheduled",
            "status": "Scheduled",
            "providers": [{
                "uuid": "dae6561f-cca8-4304-9996-6eae80892d91",
                "comments": null,
                "response": "ACCEPTED",
                "name": "Provider One"
            }, {
                "uuid": "ef3643ff-b6f7-4f27-8189-16689a821a9e",
                "comments": null,
                "response": "ACCEPTED",
                "name": "Provider Two"
            }],
            "recurring": false
        }
    },
    {
        "data": {
            "uuid": "123tr5-7y65-4708-9fcc-8c98daba0ca9",
            "appointmentNumber": "0002",
            "patient": {
                "identifier": "IQ1114",
                "name": "9DEC81BF 9DEC81C6",
                "uuid": "fda50921-d5d5-4493-8de8-6ef54c9d4481"
            },
            "service": {
                "appointmentServiceId": 1,
                "name": "Ortho Requested",
                "description": null,
                "speciality": {name: 'test speciality', uuid: '8de35e75-20e0-11e7-a53f-5usc29e530d2'},
                "startTime": "",
                "endTime": "",
                "maxAppointmentsLimit": null,
                "durationMins": null,
                "location": {"name": "Physiotherapy", "uuid": "8de35e75-20e0-11e7-a53f-000c29e530d2"},
                "uuid": "7eb76991-cc67-45c1-9cb9-93d91113672b",
                "color": "#00CED1",
                "initialAppointmentStatus": "Requested",
                "creatorName": null
            },
            "serviceType": {"duration": 30, "name": "1 session", "uuid": "50ac6a9c-158a-4743-a6b5-a4f9c9317007"},
            "startDateTime": 253400569200000,
            "endDateTime": 253400571000000,
            "appointmentKind": "Scheduled",
            "status": "Scheduled",
            "providers": [{
                "uuid": "dae6561f-cca8-4304-9996-6eae80892d91",
                "comments": null,
                "response": "ACCEPTED",
                "name": "Provider One"
            }, {
                "uuid": "ef3643ff-b6f7-4f27-8189-16689a821a9e",
                "comments": null,
                "response": "AWAITING",
                "name": "Provider Two"
            }],
            "recurring": false
        }
    },
    {
        "data": {
            "uuid": "45hj76-7y65-4708-9fcc-8c98daba0ca9",
            "appointmentNumber": "0004",
            "patient": {
                "identifier": "IQ1114",
                "name": "9DEC81BF 9DEC81C6",
                "uuid": "fda50921-d5d5-4493-8de8-6ef54c9d4481"
            },
            "service": {
                "appointmentServiceId": 1,
                "name": "Ortho Requested",
                "description": null,
                "speciality": {name: 'test speciality', uuid: '8de35e75-20e0-11e7-a53f-5usc29e530d2'},
                "startTime": "",
                "endTime": "",
                "maxAppointmentsLimit": null,
                "durationMins": null,
                "location": {"name": "Physiotherapy", "uuid": "8de35e75-20e0-11e7-a53f-000c29e530d2"},
                "uuid": "7eb76991-cc67-45c1-9cb9-93d91113672b",
                "color": "#00CED1",
                "initialAppointmentStatus": "Requested",
                "creatorName": null
            },
            "serviceType": {"duration": 30, "name": "1 session", "uuid": "50ac6a9c-158a-4743-a6b5-a4f9c9317007"},
            "startDateTime": 253400569200000,
            "endDateTime": 253400571000000,
            "appointmentKind": "Scheduled",
            "status": "Requested",
            "providers": [{
                "uuid": "ef3643ff-b6f7-4f27-8189-16689a821a9e",
                "comments": null,
                "response": "AWAITING",
                "name": "Provider Two"
            }],
            "recurring": false
        }
    },
];

export const saveOrUpdateAppointment = () => {
    return new Promise((resolve, reject) => {
        process.nextTick(() =>
            resolve(appointmentResponses[0])
        );
    });
};


export const getAppointment = (uuid) => {
    return new Promise((resolve, reject) => {
        process.nextTick(() =>
            resolve(find(appointmentResponses, ((resp) => resp.data.uuid === uuid)))
        );
    });
};

export const conflictsFor = () => {
    return {};
};
