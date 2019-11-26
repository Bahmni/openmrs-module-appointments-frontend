describe('AppointmentStatusHandler', function () {
    describe('getUpdatedStatusAndProviderResponse', function () {
        it('should set AppointmentStatus as scheduled and ProviderResponses as Accepted when Service does not have initial status', function () {
            const appointment = {service: {name: 'Service1'}, providers: [{uuid: 'xyz1', response: 'ACCEPTED'},{uuid: 'xyz2', response: 'ACCEPTED'}]};
            const currentProviderUuid = 'xyz0';

            const updatedStatusAndProviderResponse = Bahmni.Appointments.AppointmentStatusHandler.getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid);

            expect(updatedStatusAndProviderResponse.status).toBe("Scheduled");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("ACCEPTED");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("ACCEPTED");
        });

        it('should set AppointmentStatus as scheduled and ProviderResponses as Accepted when Service initial status is scheduled', function () {
            const appointment = {service: {name: 'Service1', initialAppointmentStatus:'Scheduled'}, providers: [{uuid: 'xyz1', response: 'ACCEPTED'},{uuid: 'xyz2', response: 'ACCEPTED'}]};
            const currentProviderUuid = 'xyz0';

            const updatedStatusAndProviderResponse = Bahmni.Appointments.AppointmentStatusHandler.getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid);

            expect(updatedStatusAndProviderResponse.status).toBe("Scheduled");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("ACCEPTED");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("ACCEPTED");
        });

        it('should set AppointmentStatus as requested and ProviderResponses as AWAITING when Service initial status is requested', function () {
            const appointment = {service: {name: 'Service1', initialAppointmentStatus:'Requested'}, providers: [{uuid: 'xyz1', response: 'ACCEPTED'},{uuid: 'xyz2', response: 'ACCEPTED'}]};
            const currentProviderUuid = 'xyz0';

            const updatedStatusAndProviderResponse = Bahmni.Appointments.AppointmentStatusHandler.getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid);

            expect(updatedStatusAndProviderResponse.status).toBe("Requested");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("AWAITING");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("AWAITING");
        });

        it('should set AppointmentStatus as scheduled and ProviderResponse as ACCEPTED when creator is a participant', function () {
            const appointment = {service: {name: 'Service1', initialAppointmentStatus:'Requested'}, providers: [{uuid: 'xyz1', response: 'ACCEPTED'},{uuid: 'xyz2', response: 'ACCEPTED'}]};
            const currentProviderUuid = 'xyz2';

            const updatedStatusAndProviderResponse = Bahmni.Appointments.AppointmentStatusHandler.getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid);

            expect(updatedStatusAndProviderResponse.status).toBe("Scheduled");
            expect(updatedStatusAndProviderResponse.providers[0].response).toBe("AWAITING");
            expect(updatedStatusAndProviderResponse.providers[1].response).toBe("ACCEPTED");
        });

        it('should set AppointmentStatus as scheduled when Service initial status is requested but appointment has no providers', function () {
            const appointment = {service: {name: 'Service1', initialAppointmentStatus:'Requested'}, providers: []};
            const currentProviderUuid = 'xyz2';

            const updatedStatusAndProviderResponse = Bahmni.Appointments.AppointmentStatusHandler.getUpdatedStatusAndProviderResponse(appointment, currentProviderUuid);
            expect(updatedStatusAndProviderResponse.status).toBe("Scheduled");
        });
    });

    describe('getResponseForNewProviders', function () {
        it('should set the provider response for new providers as Accepted when Service Initial status is not set', function () {
            const providers = [{uuid: 'xyz1', response: 'ACCEPTED'},{uuid: 'xyz2', response: 'ACCEPTED'}];
            const appointment = {service: {name: 'Service1'}, providers: providers};
            const currentProviderUuid = 'xyz0';

            const responseForNewProviders = Bahmni.Appointments.AppointmentStatusHandler.getResponseForNewProviders(providers, appointment, currentProviderUuid);

            expect(responseForNewProviders[0].response).toBe("ACCEPTED");
            expect(responseForNewProviders[1].response).toBe("ACCEPTED");
        });

        it('should set the provider response for new providers as Accepted when Service Initial status is Scheduled', function () {
            const providers = [{uuid: 'xyz1', response: 'ACCEPTED'},{uuid: 'xyz2', response: 'ACCEPTED'}];
            const appointment = {service: {name: 'Service1', initialAppointmentStatus:'Scheduled'}, providers: providers};
            const currentProviderUuid = 'xyz0';

            const responseForNewProviders = Bahmni.Appointments.AppointmentStatusHandler.getResponseForNewProviders(providers, appointment, currentProviderUuid);

            expect(responseForNewProviders[0].response).toBe("ACCEPTED");
            expect(responseForNewProviders[1].response).toBe("ACCEPTED");
        });

        it('should set the provider response for new providers as AWAITING when Service Initial status is Requested', function () {
            const providers = [{uuid: 'xyz1', response: 'ACCEPTED'},{uuid: 'xyz2', response: 'ACCEPTED'}];
            const appointment = {service: {name: 'Service1', initialAppointmentStatus:'Requested'}, providers: providers, initialAppointmentStatus:'Requested'};
            const currentProviderUuid = 'xyz0';
            const responseForNewProviders = Bahmni.Appointments.AppointmentStatusHandler.getResponseForNewProviders(providers, appointment, currentProviderUuid);

            expect(responseForNewProviders[0].response).toBe("AWAITING");
            expect(responseForNewProviders[1].response).toBe("AWAITING");
        });

        it('should set the current provider response as ACCEPTED when Service Initial status is Requested', function () {
            const providers = [{uuid: 'xyz1', response: 'ACCEPTED'},{uuid: 'xyz2', response: 'ACCEPTED'}];
            const appointment = {service: {name: 'Service1', initialAppointmentStatus:'Requested'}, providers: providers, initialAppointmentStatus:'Requested'};
            const currentProviderUuid = 'xyz2';

            const responseForNewProviders = Bahmni.Appointments.AppointmentStatusHandler.getResponseForNewProviders(providers, appointment, currentProviderUuid);

            expect(responseForNewProviders[0].response).toBe("AWAITING");
            expect(responseForNewProviders[1].response).toBe("ACCEPTED");
        });
    });
});