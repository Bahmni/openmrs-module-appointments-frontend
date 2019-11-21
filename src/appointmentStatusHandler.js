window.Bahmni = window.Bahmni || {};
Bahmni.Appointments = Bahmni.Appointments || {};

Bahmni.Appointments.AppointmentRequestHelper = (function () {
    const updateStatusAndProviderResponseDefault = function (allAppointmentDetails) {
        const updatedStatusAndProviderResponses = {};

        updatedStatusAndProviderResponses.status = Bahmni.Appointments.Constants.appointmentStatuses.Requested;
        updatedStatusAndProviderResponses.providers = _.map(allAppointmentDetails.providers, function (provider) {
            return {uuid: provider.uuid, response: Bahmni.Appointments.Constants.providerResponses.AWAITING};
        });
        return updatedStatusAndProviderResponses;
    };

    const updateStatusAndProviderResponseForCurrentUser = function (allAppointmentDetails, providerUuidForLoggedInUser) {
        const currentUserPartOfAppointment = _.find(allAppointmentDetails.providers, function (provider) {
            return provider.uuid === providerUuidForLoggedInUser &&
                provider.response !== Bahmni.Appointments.Constants.providerResponses.CANCELLED;
        });

        if (!currentUserPartOfAppointment) {
            return updateStatusAndProviderResponseDefault(allAppointmentDetails);
        }

        const updatedStatusAndProviderResponses = {};
        updatedStatusAndProviderResponses.status = Bahmni.Appointments.Constants.appointmentStatuses.Scheduled;
        updatedStatusAndProviderResponses.providers = _.map(allAppointmentDetails.providers, function (provider) {
            if (provider.uuid !== currentUserPartOfAppointment.uuid) {
                return {uuid: provider.uuid, response: Bahmni.Appointments.Constants.providerResponses.AWAITING};
            }else{
                return {uuid: provider.uuid, response: Bahmni.Appointments.Constants.providerResponses.ACCEPTED};
            }
        });
        return updatedStatusAndProviderResponses;
    };


    return {
        getUpdatedStatusAndProviderResponse: function (allAppointmentDetails, providerUuidForLoggedInUser) {
            const updatedStatusAndProviderResponses = {};

            const isInitialStatusRequested = allAppointmentDetails.service.initialAppointmentStatus === Bahmni.Appointments.Constants.appointmentStatuses.Requested;
            if (!isInitialStatusRequested || _.isEmpty(allAppointmentDetails.providers)) {
                updatedStatusAndProviderResponses.status = Bahmni.Appointments.Constants.appointmentStatuses.Scheduled;
                updatedStatusAndProviderResponses.providers = _.map(allAppointmentDetails.providers, function (provider) {
                    return {uuid: provider.uuid, response: Bahmni.Appointments.Constants.providerResponses.ACCEPTED};
                });
                return updatedStatusAndProviderResponses;
            }

            // return updateStatusAndProviderResponseDefault(allAppointmentDetails);

            return updateStatusAndProviderResponseForCurrentUser(allAppointmentDetails, providerUuidForLoggedInUser);
        }
    }
})();