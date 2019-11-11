import axios from "axios";
import {recurringAppointmentsConflictsUrl, recurringAppointmentsSaveUrl} from "../constants";

export const saveRecurringAppointments = async data => {
    try {
        return await axios.post(`${recurringAppointmentsSaveUrl}`, data);
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
