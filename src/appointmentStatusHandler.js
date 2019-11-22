window.Bahmni = window.Bahmni || {};
Bahmni.Appointments = Bahmni.Appointments || {};

Bahmni.Appointments.AppointmentStatusHandler = (function () {
    const updateStatusAndResponseAsRequested = function (appointment) {
        const statusAndProviderResponse = {};

        statusAndProviderResponse.status = Bahmni.Appointments.Constants.appointmentStatuses.Requested;
        const mapToAwaitingResponse = function (provider) {
            return {uuid: provider.uuid, response: Bahmni.Appointments.Constants.providerResponses.AWAITING};
        };
        statusAndProviderResponse.providers = _.map(appointment.providers, mapToAwaitingResponse);
        return statusAndProviderResponse;
    };

    const updateStatusAndResponseForCurrentProvider = function (appointment, currentProviderUuid) {
        const isCurrentProvider = function (provider) {
            return provider.uuid === currentProviderUuid &&
                provider.response !== Bahmni.Appointments.Constants.providerResponses.CANCELLED;
        };
        const currentProviderInAppointment = _.find(appointment.providers, isCurrentProvider);
        if (!currentProviderInAppointment) {
            return updateStatusAndResponseAsRequested(appointment);
        }

        const statusAndProviderResponse = {};
        statusAndProviderResponse.status = Bahmni.Appointments.Constants.appointmentStatuses.Scheduled;
        const mapResponseBasedOnProvider = function (provider) {
            if (provider.uuid !== currentProviderInAppointment.uuid) {
                return {uuid: provider.uuid, response: Bahmni.Appointments.Constants.providerResponses.AWAITING};
            }else{
                return {uuid: provider.uuid, response: Bahmni.Appointments.Constants.providerResponses.ACCEPTED};
            }
        };
        statusAndProviderResponse.providers = _.map(appointment.providers, mapResponseBasedOnProvider);
        return statusAndProviderResponse;
    };


    return {
        getUpdatedStatusAndProviderResponse: function (appointment, currentProviderUuid) {
            const statusAndProviderResponse = {};

            const isInitialStatusRequested = appointment.service.initialAppointmentStatus === Bahmni.Appointments.Constants.appointmentStatuses.Requested;
            if (!isInitialStatusRequested || _.isEmpty(appointment.providers)) {
                statusAndProviderResponse.status = Bahmni.Appointments.Constants.appointmentStatuses.Scheduled;
                const mapToAcceptedResponse = function (provider) {
                    return {uuid: provider.uuid, response: Bahmni.Appointments.Constants.providerResponses.ACCEPTED};
                };
                statusAndProviderResponse.providers = _.map(appointment.providers, mapToAcceptedResponse);
                return statusAndProviderResponse;
            }
            return updateStatusAndResponseForCurrentProvider(appointment, currentProviderUuid);
        }
    }
})();