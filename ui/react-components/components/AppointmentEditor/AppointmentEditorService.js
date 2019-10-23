import {saveOrUpdateAppointment} from '../../api/appointmentsApi';

const getFormattedProviders = providers => providers.map(provider => {
    provider.name = provider.label;
    provider.uuid = provider.value;
    delete provider.label;
    delete provider.value;
    return provider;
});

export const saveAppointment = async (appointment) => {
    getFormattedProviders(appointment.providers);
    return await saveOrUpdateAppointment(appointment);
};
