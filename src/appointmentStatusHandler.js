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

    const appointmentStatuses = function () {
        return Bahmni.Appointments.Constants.appointmentStatuses;
    };

    const providerResponses = function () {
        return Bahmni.Appointments.Constants.providerResponses;
    };

    const isStatusRequested = function (status) {
        return status === appointmentStatuses().Requested;
    };

    const isStatusScheduled = function (status) {
        return status === appointmentStatuses().Scheduled;
    };

    const isNewAppointment = function (appointment) {
        return !appointment.uuid;
    };

    const getStatusForAppointment = function (appointment) {
        if (isNewAppointment(appointment) || isStatusRequested(appointment.status)) {
            return appointmentStatuses().Scheduled;
        } else {
            return appointment.status;
        }
    };

    const updateIfCurrentProviderInAppointment = function (statusAndProviderResponse, currentProviderUuid, appointment) {
        const clone = _.cloneDeep(statusAndProviderResponse);
        const isCurrentProviderInAppointment = _.some(statusAndProviderResponse.providers, provider => provider.uuid === currentProviderUuid);
        if (!isCurrentProviderInAppointment) return clone;

        clone.status = getStatusForAppointment(appointment);
        clone.providers = _.map(clone.providers, function (provider) {
            const response = (provider.uuid === currentProviderUuid) ?
                providerResponses().ACCEPTED : provider.response;
            return {uuid: provider.uuid, response: response};
        });
        return clone;
    };

    const updateIfRescheduled = function (statusAndProviderResponse, appointment, currentProviderUuid) {
        // in this case we don't keep the existing appointment status and responses
        //this is an special edit
        const clone = _.cloneDeep(statusAndProviderResponse);
        const isCurrentProviderInAppointment = _.some(clone.providers, provider => provider.uuid === currentProviderUuid);

        clone.status = isCurrentProviderInAppointment ? appointmentStatuses().Scheduled :
            appointmentStatuses().Requested;
        clone.providers = _.map(clone.providers, function (provider) {
            const response = (provider.uuid === currentProviderUuid) ?
                providerResponses().ACCEPTED : providerResponses().AWAITING;
            return {uuid: provider.uuid, response: response};
        });
        return clone;
    };

    const updateIfAtleastOneProviderHasAccepted = function (statusAndProviderResponse) {
        //this handles special cases like,
        //  when new providers are added to a no provider appointment
        //  when only accepted provider is removed from appointment appointment

        const clone = _.cloneDeep(statusAndProviderResponse);
        const hasAtleastOneAccept = _.some(clone.providers, function (provider) {
            return provider.response === providerResponses().ACCEPTED;
        });
        if (hasAtleastOneAccept) {
            if (isStatusRequested(clone.status)) {
                clone.status = appointmentStatuses().Scheduled;
            }
        } else {
            if (isStatusScheduled(clone.status)) {
                clone.status = appointmentStatuses().Requested;
            }
        }
        return clone;
    };

    const statusAndResponseForScheduledServices = function (appointment) {
        const statusAndProviderResponse = {};
        statusAndProviderResponse.status = isNewAppointment(appointment) ?
            appointmentStatuses().Scheduled : appointment.status;
        statusAndProviderResponse.providers = _.map(appointment.providers, function (provider) {
            return {uuid: provider.uuid, response: providerResponses().ACCEPTED};
        });
        return statusAndProviderResponse;
    };

    const statusAndResponseForRequestedServices = function (appointment, existingProvidersUuids) {
        const statusAndProviderResponse = {};
        statusAndProviderResponse.status = isNewAppointment(appointment) ?
            appointmentStatuses().Requested : appointment.status;

        statusAndProviderResponse.providers = mapNewProvidersToGivenResponse(appointment, existingProvidersUuids,
            providerResponses().AWAITING);
        return statusAndProviderResponse;
    };

    const getUpdatedStatusAndProviderResponse = function (appointment, currentProviderUuid, existingProvidersUuids, isRescheduled) {
        if (!isStatusRequested(appointment.service.initialAppointmentStatus)) {
            return statusAndResponseForScheduledServices(appointment);
        }
        if (_.isEmpty(appointment.providers)) {
            return {status: getStatusForAppointment(appointment), providers:[]};
        }
        let statusAndProviderResponse = statusAndResponseForRequestedServices(appointment, existingProvidersUuids);

        statusAndProviderResponse = updateIfCurrentProviderInAppointment(statusAndProviderResponse, currentProviderUuid, appointment);
        statusAndProviderResponse = updateIfAtleastOneProviderHasAccepted(statusAndProviderResponse);

        if (isRescheduled) {
            statusAndProviderResponse = updateIfRescheduled(statusAndProviderResponse, appointment, currentProviderUuid);
        }
        return statusAndProviderResponse;
    };

    return {
        getUpdatedStatusAndProviderResponse: getUpdatedStatusAndProviderResponse,
    }
})();