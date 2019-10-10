import axios from 'axios';
import {servicesDefaultUrl} from "../constants";
import {appointmentService} from "../constants";

export const getAllServices = async () => {
    try {
        const response = await axios.get(`${servicesDefaultUrl}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const getService = async serviceUuid => {
    try {
        const response = await axios.get(`${appointmentService}?uuid=${serviceUuid}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
