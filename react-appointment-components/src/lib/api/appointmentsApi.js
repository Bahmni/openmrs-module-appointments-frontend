import axios from 'axios';
import {appointmentsSaveUrl} from "../constants";

export const saveOrUpdateAppointment = async (data) => {
    try {
        const response = await axios.post(`${appointmentsSaveUrl}`, data);
        return response;
    } catch (error) {
        console.error(error);
    }
};
