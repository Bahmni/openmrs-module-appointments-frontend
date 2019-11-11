import axios from 'axios';
import {appointmentConflictsUrl, appointmentsSaveUrl} from "../constants";

export const saveOrUpdateAppointment = async (data) => {
    try {
        const response = await axios.post(`${appointmentsSaveUrl}`, data);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const conflictsFor = async appointmentRequest => {
    try {
        return await axios.post(appointmentConflictsUrl, appointmentRequest);
    } catch (error) {
        console.error(error);
    }
};
