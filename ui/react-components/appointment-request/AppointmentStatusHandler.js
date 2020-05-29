import {APPOINTMENT_STATUSES, PROVIDER_RESPONSES} from "../constants";
import {map, isEmpty, includes, cloneDeep, some} from "lodash";

/*
/*
    Below, we are creating local variables for all the webpack import variables.
    This is avoid seeing `lodash__WEBPACK_IMPORTED_MODULE_1__["map"]` in different places in code.
    This will help to maintain readability since this file might need to be changed on the implementation after deployment.
    For more information check the docs:
    https://bahmni.atlassian.net/wiki/spaces/BAH/pages/927432705/Appointment+Request#Deciding-the-status-of-Appointment-and-Provider-Response%3A
 */
const appointmentStatusList = APPOINTMENT_STATUSES;
const providerResponseList = PROVIDER_RESPONSES;
const map_fn = map;
const isEmpty_fn = isEmpty;
const includes_fn = includes;
const cloneDeep_fn = cloneDeep;
const some_fn = some;

const mapNewProvidersToGivenResponse = function (appointment, existingProvidersUuids, response) {
    return map_fn(appointment.providers, function (provider) {
        if (includes_fn(existingProvidersUuids, provider.uuid)) {
            return {uuid: provider.uuid, response: provider.response};
        } else {
            return {uuid: provider.uuid, response: response};
        }
    });
};

const isStatusRequested = function (status) {
    return status === appointmentStatusList.Requested;
};

const isStatusScheduled = function (status) {
    return status === appointmentStatusList.Scheduled;
};

const isNewAppointment = function (appointment) {
    return !appointment.uuid;
};

const getStatusForAppointment = function (appointment) {
    if (isNewAppointment(appointment) || isStatusRequested(appointment.status)) {
        return appointmentStatusList.Scheduled;
    } else {
        return appointment.status;
    }
};

const updateIfCurrentProviderInAppointment = function (statusAndProviderResponse, currentProviderUuid, appointment) {
    const clone = cloneDeep_fn(statusAndProviderResponse);
    const isCurrentProviderInAppointment = some_fn(statusAndProviderResponse.providers, provider => provider.uuid === currentProviderUuid);
    if (!isCurrentProviderInAppointment) return clone;

    clone.status = getStatusForAppointment(appointment);
    clone.providers = map_fn(clone.providers, function (provider) {
        const response = (provider.uuid === currentProviderUuid) ?
            providerResponseList.ACCEPTED : provider.response;
        return {uuid: provider.uuid, response: response};
    });
    return clone;
};

const updateIfRescheduled = function (statusAndProviderResponse, appointment, currentProviderUuid) {
    // in this case we don't keep the existing appointment status and responses
    //this is an special edit
    const clone = cloneDeep_fn(statusAndProviderResponse);
    const isCurrentProviderInAppointment = some_fn(clone.providers, provider => provider.uuid === currentProviderUuid);

    clone.status = isCurrentProviderInAppointment ? appointmentStatusList.Scheduled :
        appointmentStatusList.Requested;
    clone.providers = map_fn(clone.providers, function (provider) {
        const response = (provider.uuid === currentProviderUuid) ?
            providerResponseList.ACCEPTED : providerResponseList.AWAITING;
        return {uuid: provider.uuid, response: response};
    });
    return clone;
};

const updateIfAtleastOneProviderHasAccepted = function (statusAndProviderResponse) {
    //this handles special cases like,
    //  when new providers are added to a no provider appointment
    //  when only accepted provider is removed from appointment appointment

    const clone = cloneDeep_fn(statusAndProviderResponse);
    const hasAtleastOneAccept = some_fn(clone.providers, function (provider) {
        return provider.response === providerResponseList.ACCEPTED;
    });
    if (hasAtleastOneAccept) {
        if (isStatusRequested(clone.status)) {
            clone.status = appointmentStatusList.Scheduled;
        }
    } else {
        if (isStatusScheduled(clone.status)) {
            clone.status = appointmentStatusList.Requested;
        }
    }
    return clone;
};

const statusAndResponseForScheduledServices = function (appointment) {
    const statusAndProviderResponse = {};
    statusAndProviderResponse.status = isNewAppointment(appointment) ?
        appointmentStatusList.Scheduled : appointment.status;
    statusAndProviderResponse.providers = map_fn(appointment.providers, function (provider) {
        return {uuid: provider.uuid, response: providerResponseList.ACCEPTED};
    });
    return statusAndProviderResponse;
};

const statusAndResponseForRequestedServices = function (appointment, existingProvidersUuids) {
    const statusAndProviderResponse = {};
    statusAndProviderResponse.status = isNewAppointment(appointment) ?
        appointmentStatusList.Requested : appointment.status;

    statusAndProviderResponse.providers = mapNewProvidersToGivenResponse(appointment, existingProvidersUuids,
        providerResponseList.AWAITING);
    return statusAndProviderResponse;
};

const getUpdatedStatusAndProviderResponse = function (appointment, currentProviderUuid, existingProvidersUuids, isRescheduled) {
    if (!isStatusRequested(appointment.service.initialAppointmentStatus)) {
        return statusAndResponseForScheduledServices(appointment);
    }
    if (isEmpty_fn(appointment.providers)) {
        return {status: getStatusForAppointment(appointment), providers: []};
    }
    let statusAndProviderResponse = statusAndResponseForRequestedServices(appointment, existingProvidersUuids);

    statusAndProviderResponse = updateIfCurrentProviderInAppointment(statusAndProviderResponse, currentProviderUuid, appointment);
    statusAndProviderResponse = updateIfAtleastOneProviderHasAccepted(statusAndProviderResponse);

    if (isRescheduled) {
        statusAndProviderResponse = updateIfRescheduled(statusAndProviderResponse, appointment, currentProviderUuid);
    }
    return statusAndProviderResponse;
};

export default getUpdatedStatusAndProviderResponse;