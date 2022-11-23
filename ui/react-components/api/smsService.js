import axios from 'axios';
import {otpServiceUrl} from "../config";

export const sendSMS = async (phoneNumber, message) => {
    try {
        var data = {
            "phoneNumber": phoneNumber,
            "message": message
        };
        const response = await axios.post(`${otpServiceUrl}/notification/sms`, data);
        return response;
    } catch (error) {
        console.error(error);
        return error.response;
    }
};
