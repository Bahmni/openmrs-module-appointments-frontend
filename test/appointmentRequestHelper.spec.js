describe('AppointmentRequestHelper#updateStatusAndProviderResponse', function () {
    it('should set AppointmentStatus as scheduled and ProviderResponses as Accepted when Service does not have initial status', function () {
        const appointmentForRequestData = {providers: [{uuid: 'xyz1', response: 'ACCEPTED'},{uuid: 'xyz2', response: 'ACCEPTED'}]};
        const allAppointmentDetails = {service: {name: 'Service1'}};
        const providerForLoggedInUser = {uuid: 'xyz0'};

        Bahmni.Appointments.AppointmentRequestHelper.updateStatusAndProviderResponse(appointmentForRequestData, allAppointmentDetails, providerForLoggedInUser);

        expect(appointmentForRequestData.status).toBe("Scheduled");
        expect(appointmentForRequestData.providers[0].response).toBe("ACCEPTED");
        expect(appointmentForRequestData.providers[1].response).toBe("ACCEPTED");
    });

    it('should set AppointmentStatus as scheduled and ProviderResponses as Accepted when Service initial status is scheduled', function () {
        const appointmentForRequestData = {providers: [{uuid: 'xyz1', response: 'ACCEPTED'},{uuid: 'xyz2', response: 'ACCEPTED'}]};
        const allAppointmentDetails = {service: {name: 'Service1', initialAppointmentStatus: 'Scheduled'}};
        const providerForLoggedInUser = {uuid: 'xyz0'};

        Bahmni.Appointments.AppointmentRequestHelper.updateStatusAndProviderResponse(appointmentForRequestData, allAppointmentDetails, providerForLoggedInUser);

        expect(appointmentForRequestData.status).toBe("Scheduled");
        expect(appointmentForRequestData.providers[0].response).toBe("ACCEPTED");
        expect(appointmentForRequestData.providers[1].response).toBe("ACCEPTED");
    });

    it('should set AppointmentStatus as requested and ProviderResponses as AWAITING when Service initial status is requested', function () {
        const appointmentForRequestData = {providers: [{uuid: 'xyz1', response: 'ACCEPTED'},{uuid: 'xyz2', response: 'ACCEPTED'}]};
        const allAppointmentDetails = {service: {name: 'Service1', initialAppointmentStatus: 'Requested'}};
        const providerForLoggedInUser = {uuid: 'xyz0'};

        Bahmni.Appointments.AppointmentRequestHelper.updateStatusAndProviderResponse(appointmentForRequestData, allAppointmentDetails, providerForLoggedInUser);

        expect(appointmentForRequestData.status).toBe("Requested");
        expect(appointmentForRequestData.providers[0].response).toBe("AWAITING");
        expect(appointmentForRequestData.providers[1].response).toBe("AWAITING");
    });

    it('should set AppointmentStatus as scheduled and ProviderResponse as ACCEPTED when creator is a participant', function () {
        const appointmentForRequestData = {providers: [{uuid: 'xyz1', response: 'ACCEPTED'},{uuid: 'xyz2', response: 'ACCEPTED'}]};
        const allAppointmentDetails = {service: {name: 'Service1', initialAppointmentStatus: 'Requested'}};
        const providerForLoggedInUser = {uuid: 'xyz2'};

        Bahmni.Appointments.AppointmentRequestHelper.updateStatusAndProviderResponse(appointmentForRequestData, allAppointmentDetails, providerForLoggedInUser);

        expect(appointmentForRequestData.status).toBe("Scheduled");
        expect(appointmentForRequestData.providers[0].response).toBe("AWAITING");
        expect(appointmentForRequestData.providers[1].response).toBe("ACCEPTED");
    });

    it('should set AppointmentStatus as scheduled when Service initial status is requested but appointment has no providers', function () {
        const appointmentForRequestData = {providers: []};
        const allAppointmentDetails = {service: {name: 'Service1', initialAppointmentStatus: 'Requested'}};
        const providerForLoggedInUser = {uuid: 'xyz0'};

        Bahmni.Appointments.AppointmentRequestHelper.updateStatusAndProviderResponse(appointmentForRequestData, allAppointmentDetails, providerForLoggedInUser);

        expect(appointmentForRequestData.status).toBe("Scheduled");
    });
});