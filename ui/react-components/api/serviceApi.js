import axios from 'axios';
import {appointmentService, servicesDefaultUrl} from "../config";

export const getAllServices = async () => {
    try {
        const response = await axios.get(`${servicesDefaultUrl}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return error.response;
    }
};

export const getService = async serviceUuid => {
    try {
        const response = await axios.get(`${appointmentService}?uuid=${serviceUuid}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return error.response;
    }
};
