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

    const updateAs = function (appointment, existingProvidersUuids, newStatus, response) {
        const statusAndProviderResponse = {};
        if (isNewAppointment(appointment)) {
            statusAndProviderResponse.status = newStatus;
        } else {
            statusAndProviderResponse.status = appointment.status;
        }
        statusAndProviderResponse.providers = mapNewProvidersToGivenResponse(appointment, existingProvidersUuids,
            response);
        return statusAndProviderResponse;
    };


    const updateAsScheduledAndAccepted = function (appointment, existingProvidersUuids) {
        return updateAs(appointment, existingProvidersUuids,
            Bahmni.Appointments.Constants.appointmentStatuses.Scheduled, Bahmni.Appointments.Constants.providerResponses.ACCEPTED);

    };

    const updateAsRequestedAndAwaiting = function (appointment, existingProvidersUuids) {
        return updateAs(appointment, existingProvidersUuids,
            Bahmni.Appointments.Constants.appointmentStatuses.Requested, Bahmni.Appointments.Constants.providerResponses.AWAITING);
    };

    function updateForCurrentProvider(statusAndProviderResponse, currentProviderUuid, appointment) {
        const currentProviderInAppointment = _.find(statusAndProviderResponse.providers, provider => provider.uuid === currentProviderUuid);
        if (currentProviderInAppointment) {
            currentProviderInAppointment.response = Bahmni.Appointments.Constants.providerResponses.ACCEPTED;
            if (isNewAppointment(appointment) || isStatusRequested(appointment.status)) {
                statusAndProviderResponse.status = Bahmni.Appointments.Constants.appointmentStatuses.Scheduled;
            } else {
                statusAndProviderResponse.status = appointment.status;
            }
        }
    }

    function handleRescheduledAppointment(statusAndProviderResponse, appointment, currentProviderUuid) {
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
    }

    function handleAtleastOneAccept(statusAndProviderResponse) {
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
    }

    const getUpdatedStatusAndProviderResponse = function (appointment, currentProviderUuid, existingProvidersUuids, isRescheduled) {
        const isInitialStatusRequested = (appointment.service.initialAppointmentStatus === Bahmni.Appointments.Constants.appointmentStatuses.Requested);
        if (!isInitialStatusRequested || _.isEmpty(appointment.providers)) {
            return updateAsScheduledAndAccepted(appointment, existingProvidersUuids);
        }
        const statusAndProviderResponse = updateAsRequestedAndAwaiting(appointment, existingProvidersUuids);

        updateForCurrentProvider(statusAndProviderResponse, currentProviderUuid, appointment);
        handleAtleastOneAccept(statusAndProviderResponse);

        if (isRescheduled){
            handleRescheduledAppointment(statusAndProviderResponse, appointment, currentProviderUuid);
        }
        return statusAndProviderResponse;
    };

    return {
        getUpdatedStatusAndProviderResponse: getUpdatedStatusAndProviderResponse,
    }
})();