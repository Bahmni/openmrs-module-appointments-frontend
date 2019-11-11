import axios from 'axios';
import {appointmentsSaveUrl, appointmentByUuidUrl} from "../constants";

export const saveOrUpdateAppointment = async (data) => {
    try {
        const response = await axios.post(`${appointmentsSaveUrl}`, data);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const getAppointment = async (appointmentUuid) => {
    try {
        const response = await axios.get(`${appointmentByUuidUrl}?uuid=${appointmentUuid}`);
        return response;
    } catch (error) {
        console.error(error);
    }
};
