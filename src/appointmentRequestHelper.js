window.Bahmni = window.Bahmni || {};
Bahmni.Appointments = Bahmni.Appointments || {};

Bahmni.Appointments.AppointmentRequestHelper = (function () {
    const updateStatusAndProviderResponseDefault = function (appointmentToBeSaved) {
        appointmentToBeSaved.status = Bahmni.Appointments.Constants.appointmentStatuses.Requested;
        _.forEach(appointmentToBeSaved.providers, function (provider) {
            provider.response = Bahmni.Appointments.Constants.providerResponses.AWAITING;
        });
    };

    const updateStatusAndProviderResponseForCurrentUser = function (appointmentToBeSaved, providerForLoggedInUser) {
        const currentUserPartOfAppointment = _.find(appointmentToBeSaved.providers, function (provider) {
            return provider.uuid === providerForLoggedInUser.uuid &&
                provider.response !== Bahmni.Appointments.Constants.providerResponses.CANCELLED;
        });

        if (!currentUserPartOfAppointment) {
            updateStatusAndProviderResponseDefault(appointmentToBeSaved);
            return;
        }
        appointmentToBeSaved.status = Bahmni.Appointments.Constants.appointmentStatuses.Scheduled;
        currentUserPartOfAppointment.response = Bahmni.Appointments.Constants.providerResponses.ACCEPTED;
        _.forEach(appointmentToBeSaved.providers, function (provider) {
            if (provider.uuid !== currentUserPartOfAppointment.uuid) {
                provider.response = Bahmni.Appointments.Constants.providerResponses.AWAITING;
            }
        });
    };


    return {
        updateStatusAndProviderResponse: function (appointmentForRequestData, allAppointmentDetails, providerForLoggedInUser) {
            const isInitialStatusRequested = allAppointmentDetails.service.initialAppointmentStatus === Bahmni.Appointments.Constants.appointmentStatuses.Requested;
            if (!isInitialStatusRequested || _.isEmpty(appointmentForRequestData.providers)) {
                appointmentForRequestData.status = Bahmni.Appointments.Constants.appointmentStatuses.Scheduled;
                _.forEach(appointmentForRequestData.providers, function (provider) {
                    provider.response = Bahmni.Appointments.Constants.providerResponses.ACCEPTED
                });
                return;
            }

            // updateStatusAndProviderResponseDefault(appointmentForRequestData);

            updateStatusAndProviderResponseForCurrentUser(appointmentForRequestData, providerForLoggedInUser);
        }
    }
})();