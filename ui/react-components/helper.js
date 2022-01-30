import {
    DEFAULT_MAX_APPOINTMENT_PROVIDERS,
    LOCATION,
    minDurationForAppointment,
    PROVIDER_RESPONSES,
    SERVICE_TYPE
} from "./constants";
import moment from "moment";

export const isSpecialitiesEnabled = appConfig => {
    if (appConfig)
        return appConfig.enableSpecialities;
    return false;
};

export const getDefaultOccurrences = appConfig => {
    if (appConfig && appConfig.recurrence)
        return Number(appConfig.recurrence.defaultNumberOfOccurrences);
};

export const maxAppointmentProvidersAllowed = appConfig => {
    if (appConfig && appConfig.maxAppointmentProviders)
        return appConfig.maxAppointmentProviders;
    return DEFAULT_MAX_APPOINTMENT_PROVIDERS;
};

export const getDuration = (service, serviceType) => (serviceType && serviceType.duration)
    || (service && service.durationMins)
    || minDurationForAppointment;

export const getYesterday = () => {
    return moment().subtract('1', 'days').endOf('day');
};

export const isServiceTypeEnabled = appConfig => {
    return appConfig && appConfig.enableServiceTypes;
};

export const getValidProviders = providers => {
    return providers && providers.filter(provider => provider.response === PROVIDER_RESPONSES.ACCEPTED);
};

export const isLocationMandatory = appConfig => {
    return appConfig && !_.isEmpty(appConfig.mandatoryAttributes.filter(fieldName => fieldName.toLowerCase() === LOCATION));
};

export const isServiceTypeMandatory = appConfig => {
    return appConfig && !_.isEmpty(appConfig.mandatoryAttributes.filter(fieldName => fieldName.toLowerCase() === SERVICE_TYPE));
};
