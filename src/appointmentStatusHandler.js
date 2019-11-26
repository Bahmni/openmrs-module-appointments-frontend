window.Bahmni = window.Bahmni || {};
Bahmni.Appointments = Bahmni.Appointments || {};

Bahmni.Appointments.AppointmentStatusHandler = (function () {
    const mapProvidersToResponse = function (providers, response) {
        return _.map(providers, function (provider) {
            return {uuid: provider.uuid, response: response};
        });
    };

    const mapResponseBasedOnCurrentProvider = function (providers, currentProvider) {
        return _.map(providers, function (provider) {
            if (provider.uuid !== currentProvider.uuid) {
                return {uuid: provider.uuid, response: Bahmni.Appointments.Constants.providerResponses.AWAITING};
            } else {
                return {uuid: provider.uuid, response: Bahmni.Appointments.Constants.providerResponses.ACCEPTED};
            }
        })
    };

    const updateStatusAndResponseAsRequested = function (appointment) {
        const statusAndProviderResponse = {};

        statusAndProviderResponse.status = Bahmni.Appointments.Constants.appointmentStatuses.Requested;
        statusAndProviderResponse.providers = mapProvidersToResponse(appointment.providers, Bahmni.Appointments.Constants.providerResponses.AWAITING);
        return statusAndProviderResponse;
    };

    function getCurrentProviderInAppointment(appointment, currentProviderUuid) {
        const isCurrentProvider = function (provider) {
            return provider.uuid === currentProviderUuid &&
                provider.response !== Bahmni.Appointments.Constants.providerResponses.CANCELLED;
        };
        return _.find(appointment.providers, isCurrentProvider);
    }

    const updateStatusAndResponseForCurrentProvider = function (appointment, currentProviderUuid) {
        const currentProviderInAppointment = getCurrentProviderInAppointment(appointment, currentProviderUuid);
        if (_.isUndefined(currentProviderInAppointment)) {
            return updateStatusAndResponseAsRequested(appointment);
        }
        const statusAndProviderResponse = {};
        statusAndProviderResponse.status = Bahmni.Appointments.Constants.appointmentStatuses.Scheduled;
        statusAndProviderResponse.providers = mapResponseBasedOnCurrentProvider(appointment.providers, currentProviderInAppointment);
        return statusAndProviderResponse;
    };

    const updatedStatusAndProviderResponse = function (appointment, currentProviderUuid) {
        const statusAndProviderResponse = {};

        const isInitialStatusRequested = appointment.service.initialAppointmentStatus === Bahmni.Appointments.Constants.appointmentStatuses.Requested;
        if (!isInitialStatusRequested || _.isEmpty(appointment.providers)) {
            statusAndProviderResponse.status = Bahmni.Appointments.Constants.appointmentStatuses.Scheduled;
            statusAndProviderResponse.providers = mapProvidersToResponse(appointment.providers, Bahmni.Appointments.Constants.providerResponses.ACCEPTED);
            return statusAndProviderResponse;
        }
        return updateStatusAndResponseForCurrentProvider(appointment, currentProviderUuid);
    };

    const getResponseForNewProviders = function (newProviders, appointment, currentProviderUuid) {
        const isInitialStatusRequested = appointment.service.initialAppointmentStatus === Bahmni.Appointments.Constants.appointmentStatuses.Requested;

        if (!isInitialStatusRequested) {
            return mapProvidersToResponse(newProviders, Bahmni.Appointments.Constants.providerResponses.ACCEPTED);
        }
        const currentProviderInAppointment = getCurrentProviderInAppointment(appointment, currentProviderUuid);
        if (_.isUndefined(currentProviderInAppointment)) {
            return mapProvidersToResponse(newProviders, Bahmni.Appointments.Constants.providerResponses.AWAITING);
        }
        return mapResponseBasedOnCurrentProvider(newProviders, currentProviderInAppointment);
    };

    return {
        getUpdatedStatusAndProviderResponse: updatedStatusAndProviderResponse,
        getResponseForNewProviders: getResponseForNewProviders
    }
})();