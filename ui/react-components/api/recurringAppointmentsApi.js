import axios from "axios";
import {recurringAppointmentByUuidUrl, recurringAppointmentsConflictsUrl, recurringAppointmentsSaveUrl} from "../constants";

export const saveRecurringAppointments = async data => {
    try {
        return await axios.post(`${recurringAppointmentsSaveUrl}`, data);
    } catch (error) {
        console.error(error);
    }
};

export const getRecurringAppointmentByUuid = async (appointmentUuid) => {
    try {
        const response = await axios.get(`${recurringAppointmentByUuidUrl}?uuid=${appointmentUuid}`);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const recurringConflictsFor = async recurringAppointmentRequest => {
    try {
        return await axios.post(recurringAppointmentsConflictsUrl, recurringAppointmentRequest);
    } catch (error) {
        console.error(error);
    }
};
