describe('AppointmentStatusHandler#getUpdatedStatusAndProviderResponse', function () {
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