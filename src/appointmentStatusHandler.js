window.Bahmni = window.Bahmni || {};
Bahmni.Appointments = Bahmni.Appointments || {};

Bahmni.Appointments.AppointmentStatusHandler = (function () {
    const mapNewProvidersToGivenResponse = function (appointment, existingProvidersUuids, response) {
        return _.map(appointment.providers, function (provider) {
            if (_.includes(existingProvidersUuids, provider.uuid)) {
                return {uuid: provider.uuid, response: provider.response};
            } else {
                return {uuid: provider.uuid, response: response};
            }
        });
    };

    const isStatusRequested = function (status) {
        return status === Bahmni.Appointments.Constants.appointmentStatuses.Requested;
    };

    const isStatusScheduled = function (status) {
        return status === Bahmni.Appointments.Constants.appointmentStatuses.Scheduled;
    };

    const isNewAppointment = function (appointment) {
        return !appointment.uuid;
    };

    const updateIfCurrentProviderInAppointment = function (statusAndProviderResponse, currentProviderUuid, appointment) {
        const currentProviderInAppointment = _.find(statusAndProviderResponse.providers, provider => provider.uuid === currentProviderUuid);
        if (!currentProviderInAppointment) return;

        currentProviderInAppointment.response = Bahmni.Appointments.Constants.providerResponses.ACCEPTED;
        if (isNewAppointment(appointment) || isStatusRequested(appointment.status)) {
            statusAndProviderResponse.status = Bahmni.Appointments.Constants.appointmentStatuses.Scheduled;
        } else {
            statusAndProviderResponse.status = appointment.status;
        }
    };

    const handleRescheduledAppointment = function (statusAndProviderResponse, appointment, currentProviderUuid) {
        //this is an special edit
        // in this case we don't keep the existing appointment status and responses
        statusAndProviderResponse.status = Bahmni.Appointments.Constants.appointmentStatuses.Requested;
        statusAndProviderResponse.providers = _.map(appointment.providers, function (provider) {
            return {uuid: provider.uuid, response: Bahmni.Appointments.Constants.providerResponses.AWAITING}
        });

        const currentProviderInAppointment = _.find(statusAndProviderResponse.providers, provider => provider.uuid === currentProviderUuid);
        if (currentProviderInAppointment) {
            statusAndProviderResponse.status = Bahmni.Appointments.Constants.appointmentStatuses.Scheduled;
            currentProviderInAppointment.response = Bahmni.Appointments.Constants.providerResponses.ACCEPTED;
        }
    };

    const updateIfAtleastOneProviderHasAccepted = function (statusAndProviderResponse) {
        //this handles special cases like,
        //  when new providers are added to a no provider appointment
        //  when only accepted provider is removed from appointment appointment
        const hasAtleastOneAccept = _.some(statusAndProviderResponse.providers, function (provider) {
            return provider.response === Bahmni.Appointments.Constants.providerResponses.ACCEPTED;
        });
        if (hasAtleastOneAccept) {
            if (isStatusRequested(statusAndProviderResponse.status)) {
                statusAndProviderResponse.status = Bahmni.Appointments.Constants.appointmentStatuses.Scheduled;
            }
        } else {
            if (isStatusScheduled(statusAndProviderResponse.status)) {
                statusAndProviderResponse.status = Bahmni.Appointments.Constants.appointmentStatuses.Requested;
            }
        }
    };

    const statusAndResponseForZeroProviders = function (appointment) {
        const statusAndProviderResponse = {providers: []};
        if (isNewAppointment(appointment) || isStatusRequested(appointment.status)) {
            statusAndProviderResponse.status = Bahmni.Appointments.Constants.appointmentStatuses.Scheduled;
        } else {
            statusAndProviderResponse.status = appointment.status;
        }
        return statusAndProviderResponse;
    };


    const statusAndResponseForScheduledServices = function (appointment) {
        const statusAndProviderResponse = {};
        statusAndProviderResponse.status = isNewAppointment(appointment) ?
            Bahmni.Appointments.Constants.appointmentStatuses.Scheduled : appointment.status;
        statusAndProviderResponse.providers = _.map(appointment.providers, function (provider) {
            return {uuid: provider.uuid, response: Bahmni.Appointments.Constants.providerResponses.ACCEPTED};
        });
        return statusAndProviderResponse;
    };

    const statusAndResponseForRequestedServices = function (appointment, existingProvidersUuids) {
        const statusAndProviderResponse = {};
        statusAndProviderResponse.status = isNewAppointment(appointment) ?
            Bahmni.Appointments.Constants.appointmentStatuses.Requested : appointment.status;

        statusAndProviderResponse.providers = mapNewProvidersToGivenResponse(appointment, existingProvidersUuids,
            Bahmni.Appointments.Constants.providerResponses.AWAITING);
        return statusAndProviderResponse;
    };

    const getUpdatedStatusAndProviderResponse = function (appointment, currentProviderUuid, existingProvidersUuids, isRescheduled) {
        if (!isStatusRequested(appointment.service.initialAppointmentStatus)) {
            return statusAndResponseForScheduledServices(appointment);
        }
        if (_.isEmpty(appointment.providers)) {
            return statusAndResponseForZeroProviders(appointment);
        }
        const statusAndProviderResponse = statusAndResponseForRequestedServices(appointment, existingProvidersUuids);

        updateIfCurrentProviderInAppointment(statusAndProviderResponse, currentProviderUuid, appointment);
        updateIfAtleastOneProviderHasAccepted(statusAndProviderResponse);

        if (isRescheduled) {
            handleRescheduledAppointment(statusAndProviderResponse, appointment, currentProviderUuid);
        }
        return statusAndProviderResponse;
    };

    return {
        getUpdatedStatusAndProviderResponse: getUpdatedStatusAndProviderResponse,
    }
})();