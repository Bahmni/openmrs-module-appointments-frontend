import axios from 'axios';
import {specialityUrl} from "../config";

export const getAllSpecialities = async () => {
    try {
        const response = await axios.get(specialityUrl);
        return response.data;
    } catch (error) {
        console.error(error);
        return error.response;
    }
};
