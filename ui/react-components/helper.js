import {DEFAULT_MAX_APPOINTMENT_PROVIDERS, minDurationForAppointment, PROVIDER_RESPONSES, enableAppointmentPriorityOption} from "./constants";
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

export const isActiveProvider = function (provider) {
    return provider.response !== PROVIDER_RESPONSES.CANCELLED;
};

export const getValidProviders = providers => {
    return providers && providers.filter(isActiveProvider);
};

export const searchFieldOnChangeHandler=(state, setState, selectedState, setSelectedState, eventChangedValue)=>{
    setSelectedState([
        ...selectedState,
        eventChangedValue
      ]);
      setState(() =>
        [...state].filter(item => item !== eventChangedValue)
      );
}

export const searchFieldOnRemoveHandler=(state, setState, selectedState, setSelectedState, eventChangedValue)=>{
    setSelectedState(() =>
      [...selectedState].filter(item => item.value !== eventChangedValue)
    );
    setState([
      ...state,
      { value: eventChangedValue, label: eventChangedValue }
    ]);
}

export const isAppointmentPriorityOptionEnabled = appConfig => {
    if (appConfig && appConfig.enablePriorityOption)
        return appConfig.enablePriorityOption;
    return false;
};

export const isAppointmentStatusOptionEnabled = appConfig => {
    return appConfig && appConfig.enableAppointmentStatusOption;
};
