import axios from 'axios';
import {appointmentsSaveUrl} from "../constants";

export const saveAppointment = async (data) => {
    try {
        const response = await axios.post(`${appointmentsSaveUrl}`, data);
        return response;
    } catch (error) {
        console.error(error);
    }
};
