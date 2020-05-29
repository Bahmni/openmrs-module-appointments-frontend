import getUpdatedStatusAndProviderResponse from './AppointmentStatusHandler';

describe('AppointmentStatusHandler#getUpdatedStatusAndProviderResponse', function () {
    describe('Create Scenario', function () {
        it('should set AppointmentStatus as scheduled and ProviderResponses as Accepted when Service does not have initial status', function () {
            const appointment = {
                service: {name: 'Service1'},
                providers: [{uuid: 'xyz1', response: 'ACCEPTED'}, {uuid: 'xyz2', response: 'ACCEPTED'}]
            };
            const currentProviderUuid = 'xyz0';

            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid);

            expect(updatedStatusAndProviderResponse.status).toBe("Scheduled");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("ACCEPTED");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("ACCEPTED");
        });

        it('should set AppointmentStatus as scheduled and ProviderResponses as Accepted when Service initial status is scheduled', function () {
            const appointment = {
                service: {name: 'Service1', initialAppointmentStatus: 'Scheduled'},
                providers: [{uuid: 'xyz1', response: 'ACCEPTED'}, {uuid: 'xyz2', response: 'ACCEPTED'}]
            };
            const currentProviderUuid = 'xyz0';

            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid);

            expect(updatedStatusAndProviderResponse.status).toBe("Scheduled");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("ACCEPTED");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("ACCEPTED");
        });

        it('should set AppointmentStatus as requested and ProviderResponses as AWAITING when Service initial status is requested', function () {
            const appointment = {
                service: {name: 'Service1', initialAppointmentStatus: 'Requested'},
                providers: [{uuid: 'xyz1', response: 'ACCEPTED'}, {uuid: 'xyz2', response: 'ACCEPTED'}]
            };
            const currentProviderUuid = 'xyz0';

            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid);

            expect(updatedStatusAndProviderResponse.status).toBe("Requested");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("AWAITING");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("AWAITING");
        });

        it('should set AppointmentStatus as scheduled and ProviderResponse as ACCEPTED when creator is a participant', function () {
            const appointment = {
                service: {name: 'Service1', initialAppointmentStatus: 'Requested'},
                providers: [{uuid: 'xyz1', response: 'ACCEPTED'}, {uuid: 'xyz2', response: 'ACCEPTED'}]
            };
            const currentProviderUuid = 'xyz2';

            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid);

            expect(updatedStatusAndProviderResponse.status).toBe("Scheduled");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("AWAITING");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("ACCEPTED");
        });

        it('should set AppointmentStatus as scheduled when Service initial status is requested but appointment has no providers', function () {
            const appointment = {service: {name: 'Service1', initialAppointmentStatus: 'Requested'}, providers: []};
            const currentProviderUuid = 'xyz2';

            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid);
            expect(updatedStatusAndProviderResponse.status).toBe("Scheduled");
        });
    });

    describe('Edit Scenario', function () {
        it('should keep the existing status of appointment if initial status is scheduled', function () {
            const providers = [{uuid: 'xyz1', response: 'ACCEPTED'}, {uuid: 'xyz2', response: 'ACCEPTED'}];
            const appointment = {service: {name: 'Service1'}, providers: providers, uuid: '1234', status: "CheckedIn"};
            const currentProviderUuid = 'xyz0';

            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid, ['xyz1']);

            expect(updatedStatusAndProviderResponse.status).toBe("CheckedIn");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("ACCEPTED");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("ACCEPTED");
        });

        it('should set the provider response for new providers as Accepted when Service Initial status is not set', function () {
            const providers = [{uuid: 'xyz1', response: 'ACCEPTED'}, {uuid: 'xyz2', response: 'ACCEPTED'}];
            const appointment = {service: {name: 'Service1'}, providers: providers, uuid: '1234', status: "Scheduled"};
            const currentProviderUuid = 'xyz0';

            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid, ['xyz1']);

            expect(updatedStatusAndProviderResponse.status).toBe("Scheduled");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("ACCEPTED");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("ACCEPTED");
        });

        it('should set the provider response for new providers as Accepted when Service Initial status is Scheduled', function () {
            const providers = [{uuid: 'xyz1', response: 'ACCEPTED'}, {uuid: 'xyz2', response: 'ACCEPTED'}];
            const appointment = {
                service: {name: 'Service1', initialAppointmentStatus: 'Scheduled'},
                providers: providers,
                uuid: '1234',
                status: "Scheduled"
            };
            const currentProviderUuid = 'xyz0';

            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid, ['xyz1']);

            expect(updatedStatusAndProviderResponse.status).toBe("Scheduled");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("ACCEPTED");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("ACCEPTED");
        });

        it('should set the provider response for new providers as AWAITING when Service Initial status is Requested', function () {
            const providers = [{uuid: 'xyz1', response: 'AWAITING'}, {uuid: 'xyz2', response: 'ACCEPTED'}];
            const appointment = {
                service: {name: 'Service1', initialAppointmentStatus: 'Requested'},
                providers: providers,
                uuid: '1234',
                status: "Requested"
            };
            const currentProviderUuid = 'xyz0';
            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid, ['xyz1']);

            expect(updatedStatusAndProviderResponse.status).toBe("Requested");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("AWAITING");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("AWAITING");
        });

        it('should set the current provider response as ACCEPTED even if Service Initial status is Requested', function () {
            const providers = [{uuid: 'xyz1', response: 'AWAITING'}, {
                uuid: 'xyz2',
                response: 'ACCEPTED'
            }, {uuid: 'xyz3', response: 'ACCEPTED'}];
            const appointment = {
                service: {name: 'Service1', initialAppointmentStatus: 'Requested'},
                providers: providers,
                uuid: '1234',
                status: 'Scheduled'
            };
            const currentProviderUuid = 'xyz2';

            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid, ['xyz1']);

            expect(updatedStatusAndProviderResponse.status).toBe("Scheduled");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("AWAITING");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("ACCEPTED");
            expect(updatedStatusAndProviderResponse.providers[2].response).toBe("AWAITING");
        });

        it('should set the status as Scheduled when current user gets added to a existing requested appointment', function () {
            const providers = [{uuid: 'xyz1', response: 'AWAITING'}, {
                uuid: 'xyz2',
                response: 'ACCEPTED'
            }, {uuid: 'xyz3', response: 'AWAITING'}];
            const appointment = {
                service: {name: 'Service1', initialAppointmentStatus: 'Requested'},
                providers: providers,
                uuid: '1234',
                status: 'Requested'
            };
            const currentProviderUuid = 'xyz2';

            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid, ['xyz1', 'xyz3']);

            expect(updatedStatusAndProviderResponse.status).toBe("Scheduled");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("AWAITING");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("ACCEPTED");
            expect(updatedStatusAndProviderResponse.providers[2].response).toBe("AWAITING");
        });

        it('should not change status when current user gets added to a existing checked-in appointment', function () {
            const providers = [{uuid: 'xyz1', response: 'AWAITING'}, {
                uuid: 'xyz2',
                response: 'ACCEPTED'
            }, {uuid: 'xyz3', response: 'AWAITING'}];
            const appointment = {
                service: {name: 'Service1', initialAppointmentStatus: 'Requested'},
                providers: providers,
                uuid: '1234',
                status: 'CheckedIn'
            };
            const currentProviderUuid = 'xyz2';

            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid, ['xyz1', 'xyz3']);

            expect(updatedStatusAndProviderResponse.status).toBe("CheckedIn");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("AWAITING");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("ACCEPTED");
            expect(updatedStatusAndProviderResponse.providers[2].response).toBe("AWAITING");
        });

        it('should change status to requested if providers are added to a appointment with no providers', function () {
            const providers = [{uuid: 'xyz1', response: 'ACCEPTED'}, {
                uuid: 'xyz2',
                response: 'ACCEPTED'
            }, {uuid: 'xyz3', response: 'ACCEPTED'}];
            const appointment = {
                service: {name: 'Service1', initialAppointmentStatus: 'Requested'},
                providers: providers,
                uuid: '1234',
                status: 'Scheduled'
            };
            const currentProviderUuid = 'xyz0';

            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid, []);

            expect(updatedStatusAndProviderResponse.status).toBe("Requested");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("AWAITING");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("AWAITING");
            expect(updatedStatusAndProviderResponse.providers[2].response).toBe("AWAITING");
        });

        it('should change status to requested if providers removes self and no other providers are accepted', function () {
            const providers = [{uuid: 'xyz1', response: 'AWAITING'}, {uuid: 'xyz3', response: 'AWAITING'}];
            const appointment = {
                service: {name: 'Service1', initialAppointmentStatus: 'Requested'},
                providers: providers,
                uuid: '1234',
                status: 'Scheduled'
            };
            const currentProviderUuid = 'xyz0';

            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid, ['xyz1','xyz2','xyz3']);

            expect(updatedStatusAndProviderResponse.status).toBe("Requested");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("AWAITING");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("AWAITING");
        });

        it('should change status to scheduled from requested if all awaiting provider gets removed', function () {
            const providers = [{uuid: 'xyz1', response: 'AWAITING'}, {uuid: 'xyz3', response: 'AWAITING'}];
            const appointment = {
                service: {name: 'Service1', initialAppointmentStatus: 'Requested'},
                providers: [],
                uuid: '1234',
                status: 'Requested'
            };
            const currentProviderUuid = 'xyz0';

            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid, ['xyz1','xyz3']);

            expect(updatedStatusAndProviderResponse.status).toBe("Scheduled");
        });

    });

    describe('Reschedule Scenario', function () {
        it('should change the status to requested and provider response to AWAITING when rescheduled', function () {
            const providers = [{uuid: 'xyz1', response: 'ACCEPTED'}, {uuid: 'xyz2', response: 'ACCEPTED'}];
            const appointment = {service: {name: 'Service1', initialAppointmentStatus:'Requested'}, providers: providers, uuid: '1234', status: "Scheduled"};
            const currentProviderUuid = 'xyz0';

            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid, ['xyz1'], true);

            expect(updatedStatusAndProviderResponse.status).toBe("Requested");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("AWAITING");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("AWAITING");
        });

        it('should change the status to scheduled and current provider response to ACCEPTED when rescheduled is done by participant', function () {
            const providers = [{uuid: 'xyz1', response: 'ACCEPTED'}, {uuid: 'xyz2', response: 'ACCEPTED'}];
            const appointment = {service: {name: 'Service1', initialAppointmentStatus:'Requested'}, providers: providers, uuid: '1234', status: "Scheduled"};
            const currentProviderUuid = 'xyz2';

            const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid, [], true);

            expect(updatedStatusAndProviderResponse.status).toBe("Scheduled");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("AWAITING");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("ACCEPTED");
        });
    });
});