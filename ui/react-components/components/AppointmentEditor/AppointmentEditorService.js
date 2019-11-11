import {conflictsFor, saveOrUpdateAppointment} from '../../api/appointmentsApi';
import {recurringConflictsFor, saveRecurringAppointments} from "../../api/recurringAppointmentsApi";

const updateProviders = providers => providers.forEach(provider => {
    provider.name = provider.label;
    provider.uuid = provider.value;
    delete provider.label;
    delete provider.value;
    return provider;
});

export const saveAppointment = async (appointment) => {
    updateProviders(appointment.providers);
    return await saveOrUpdateAppointment(appointment);
};

export const saveRecurring = async recurringRequest => {
    updateProviders(recurringRequest.appointmentRequest.providers);
    return await saveRecurringAppointments(recurringRequest);
};

export const getAppointmentConflicts = async appointment => {
    updateProviders(appointment.providers);
    return await conflictsFor(appointment);
};

export const getRecurringAppointmentsConflicts = async recurringAppointmentRequest => {
    updateProviders(recurringAppointmentRequest.appointmentRequest.providers);
    return await recurringConflictsFor(recurringAppointmentRequest);
};
