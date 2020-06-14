const services = [{
    "appointmentServiceId": 1,
    "name": "Physiotherapy OPD",
    "description": null,
    "speciality": { "name": "Cardiology", "uuid": "78ec2222-2222-457d-b798-fe37c3dc7256" },
    "startTime": "",
    "endTime": "",
    "maxAppointmentsLimit": null,
    "durationMins": null,
    "location": { "name": "Physiotherapy", "uuid": "8de35e75-20e0-11e7-a53f-000c29e530d2" },
    "uuid": "2b87edcf-39ac-4dec-94c9-713b932e847c",
    "color": "#00CED1",
    "creatorName": null
}, {
    "appointmentServiceId": 2,
    "name": "Dressing",
    "description": "Dressings for orthopedic, maxillo-facial, plastic, including tissue expander",
    "speciality": { "name": "Cardiology", "uuid": "78ec2222-2222-457d-b798-fe37c3dc7256" },
    "startTime": "",
    "endTime": "",
    "maxAppointmentsLimit": null,
    "durationMins": null,
    "location": { "name": "OPD", "uuid": "71361c6a-9f64-11e7-b330-000c29e530d2" },
    "uuid": "7eb76991-cc67-45c1-9cb9-93d91113673a",
    "color": "#DC143C",
    "creatorName": null
},
{
    "appointmentServiceId": 3,
    "name": "Ortho Requested",
    "description": "Dressings for orthopedic, maxillo-facial, plastic, including tissue expander",
    "speciality": { "name": "Cardiology", "uuid": "78ec2222-2222-457d-b798-fe37c3dc7256" },
    "startTime": "",
    "endTime": "",
    "maxAppointmentsLimit": null,
    "durationMins": null,
    "location": { "name": "OPD", "uuid": "71361c6a-9f64-11e7-b330-000c29e530d2" },
    "uuid": "7eb76991-cc67-45c1-9cb9-93d91113672b",
    "color": "#DC143C",
    "creatorName": null,
    "initialAppointmentStatus": "Requested"
}];

const service = {
    "appointmentServiceId": 2,
    "name": "Dressing",
    "description": "Dressings for orthopedic, maxillo-facial, plastic, including tissue expander",
    "speciality": { "name": "Cardiology", "uuid": "78ec2222-2222-457d-b798-fe37c3dc7256" },
    "startTime": "",
    "endTime": "",
    "maxAppointmentsLimit": null,
    "durationMins": null,
    "location": { "name": "OPD", "uuid": "71361c6a-9f64-11e7-b330-000c29e530d2" },
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

export const getAllServices = () => {
    return new Promise((resolve, reject) => {
        process.nextTick(() =>
            resolve(services)
        );
    });
};

export const getService = (uuid) => {
    return new Promise((resolve, reject) => {
        process.nextTick(() =>
            uuid === "74d43c99-fee1-4097-904a-e2292711b27f" ? resolve(service) : resolve([])
        );
    });
};