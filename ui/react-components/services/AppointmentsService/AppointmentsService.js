import {conflictsFor, saveOrUpdateAppointment} from '../../api/appointmentsApi';
import {recurringConflictsFor, saveRecurringAppointments} from "../../api/recurringAppointmentsApi";

const getProviders = providers => providers.map(provider => {
    return {
        name: provider.label,
        uuid: provider.value,
    }
});

export const saveAppointment = async (appointment) => {
    const providers = getProviders(appointment.providers);
    return await saveOrUpdateAppointment({...appointment, providers});
};

export const saveRecurring = async recurringAppointmentRequest => {
    const providers = getProviders(recurringAppointmentRequest.appointmentRequest.providers);
    return await saveRecurringAppointments(updateProvidersFor(recurringAppointmentRequest, providers));
};

export const getAppointmentConflicts = async appointment => {
    const providers = getProviders(appointment.providers);
    return await conflictsFor({...appointment, providers});
};

export const getRecurringAppointmentsConflicts = async recurringAppointmentRequest => {
    const providers = getProviders(recurringAppointmentRequest.appointmentRequest.providers);
    return await recurringConflictsFor(updateProvidersFor(recurringAppointmentRequest, providers));
};

const updateProvidersFor = (recurringAppointmentRequest, providers) => {
    return {...recurringAppointmentRequest,
        ...{appointmentRequest: {...recurringAppointmentRequest.appointmentRequest, ...{providers}}}
    };
};
