import axios from "axios";
import {recurringAppointmentsConflictsUrl, recurringAppointmentsSaveUrl} from "../constants";

export const saveRecurringAppointments = async data => {
    try {
        return await axios.post(`${recurringAppointmentsSaveUrl}`, data);
    } catch (error) {
        console.error(error);
    }
};

export const getRecurringConflicts = async request => {
    try {
        return await axios.post(recurringAppointmentsConflictsUrl, request);
    } catch (error) {
        console.error(error);
    }
};
