import axios from 'axios';
import {getFromGlobalProperty} from "../api/configApi";
import {isEmpty} from 'lodash';

export const sendSMS = async (phoneNumber, message) => {
    try {
        if (phoneNumber && !(isEmpty(message))) {
            var data = {
                "phoneNumber": phoneNumber,
                "message": message
            };
            const smsEndpoint = await getFromGlobalProperty("sms.endpoint");
            if (smsEndpoint != undefined && smsEndpoint != '') {
                const response = await axios.post(smsEndpoint, data);
                return response;
            }
        }
    } catch (error) {
        return error.response;
    }
};
