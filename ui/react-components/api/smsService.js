import axios from 'axios';
import {otpServiceUrl} from "../config";
import {isEmpty} from 'lodash';

export const sendSMS = async (phoneNumber, message) => {
    try {
        if (phoneNumber && !(isEmpty(message))) {
            var data = {
                "phoneNumber": phoneNumber,
                "message": message
            };
        const response = await axios.post(`${otpServiceUrl}/notification/sms`, data);
        return response;
        }
    } catch (error) {
        console.error(error);
        return error.response;
    }
};
