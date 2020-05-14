import axios from "axios";
import {recurringAppointmentFetchUrl, recurringAppointmentsConflictsUrl, recurringAppointmentsSaveUrl} from "../config";

export const saveRecurringAppointments = async data => {
    try {
        return await axios.post(`${recurringAppointmentsSaveUrl}`, data);
    } catch (error) {
        console.error(error);
        return error.response;
    }
};

export const updateRecurringAppointments = async data => {
    try {
        return await axios.put(`${recurringAppointmentsSaveUrl}/${data.appointmentRequest.uuid}`, data);
    } catch (error) {
        console.error(error);
        return error.response;
    }
};

export const getRecurringAppointment = async (appointmentUuid) => {
    try {
        const response = await axios.get(`${recurringAppointmentFetchUrl}?uuid=${appointmentUuid}`);
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
        return error.response;
    }
};
