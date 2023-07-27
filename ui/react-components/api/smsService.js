import axios from 'axios';
import {appointmentSmsUrl} from "../config";
export const sendSMS = async (appointmentUuid) => {
    try {
        const smsEndpoint = appointmentUuid
            ? `${appointmentSmsUrl}${appointmentUuid}`
            : `${appointmentSmsUrl}`;


        const response = await axios.post(smsEndpoint);
        return response;
    } catch (error) {
        return error.response;
    }
};
