import {PROVIDER_RESPONSES} from "../constants";
import {cloneDeep, each, find, isUndefined, map} from "lodash";
import {isActiveProvider} from "../helper";

const updateProviderResponse = function (updatedProviders, appointmentRequest) {
    each(appointmentRequest.providers, function (providerInAppointment) {
        if (isActiveProvider(providerInAppointment)) {
            const updatedProvider = find(updatedProviders, function (providerWithUpdatedResponse) {
                return providerWithUpdatedResponse.uuid === providerInAppointment.value;
            });
            if (!isUndefined(updatedProvider)) {
                providerInAppointment.response = updatedProvider.response;
            }
        }
    });
};

async function dynamicImportStatusHandler() {
    /*
    We are importing AppointmentStatusHandler dynamically so webpack doesn't bundle it in appointment.js.
    This way it will treated as separate chunk and will be it's own JS file next to appointment.js
    This is needed so that the AppointmentStatus strategy could be configured based on the implementation after deployment.
    For more information check the docs:
    https://bahmni.atlassian.net/wiki/spaces/BAH/pages/927432705/Appointment+Request#Deciding-the-status-of-Appointment-and-Provider-Response%3A
    * */
    return await import('./AppointmentStatusHandler');
}

const updateAppointmentStatusAndProviderResponse = async function (appointmentDetails, appointmentRequest,
                                                                   currentProviderUuid, existingProvidersUuids, isRescheduled) {
    const {default: getUpdatedStatusAndProviderResponse} = await dynamicImportStatusHandler();
    const allAppointmentDetails = cloneDeep(appointmentRequest);
    allAppointmentDetails.service = appointmentDetails.service.value;
    allAppointmentDetails.providers = map(appointmentRequest.providers, provider => ({
        response: provider.response,
        uuid: provider.value
    }));

    const updatedStatusAndProviderResponse = getUpdatedStatusAndProviderResponse(allAppointmentDetails,
        currentProviderUuid, existingProvidersUuids, isRescheduled);
    appointmentRequest.status = updatedStatusAndProviderResponse.status;
    updateProviderResponse(updatedStatusAndProviderResponse.providers, appointmentRequest);
};


export default updateAppointmentStatusAndProviderResponse;