import {saveOrUpdateAppointment} from '../../api/appointmentsApi';
import {saveRecurringAppointments} from "../../api/recurringAppointmentsApi";

const getFormattedProviders = providers => providers.forEach(provider => {
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

export const saveRecurring = async recurringRequest => {
    getFormattedProviders(recurringRequest.appointmentRequest.providers);
    return await saveRecurringAppointments(recurringRequest);
};
