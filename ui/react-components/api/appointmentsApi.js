import axios from 'axios';
import {appointmentByUuidUrl, appointmentConflictsUrl, appointmentSaveUrl, appointmentSummaryUrl, searchAppointmentsUrl} from "../config";

export const saveOrUpdateAppointment = async (data) => {
    try {
        const response = await axios.post(`${appointmentSaveUrl}`, data);
        return response;
    } catch (error) {
        console.error(error);
        return error.response;
    }
};

export const conflictsFor = async appointmentRequest => {
    try {
        return await axios.post(appointmentConflictsUrl, appointmentRequest);
    } catch (error) {
        console.error(error);
        return error.response;
    }
};

export const getAppointment = async (appointmentUuid) => {
    try {
        const response = await axios.get(`${appointmentByUuidUrl}?uuid=${appointmentUuid}`);
        return response;
    } catch (error) {
        console.error(error);
        return error.response;
    }
};

export const getAppointmentSummary = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${appointmentSummaryUrl}?endDate=${endDate}&startDate=${startDate}`);
        return response
    } catch (error) {
        console.error(error);
        return error.response;
    }
};

export const searchAppointments = async (payload) => {
    try{
        return await axios.post(`${searchAppointmentsUrl}`, payload)
    } catch (error) {
        console.error(error);
        return error.response;
    }
}
