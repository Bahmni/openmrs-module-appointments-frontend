import axios from 'axios';
import {patientUrl, searchPatientUrl} from '../config';

export const getPatientsByLocation = async (locationUuid, searchQuery, startIndex = 0) => {
    try {
        const response = await axios.get(`${searchPatientUrl}?loginLocationUuid=${locationUuid}&filterOnAllIdentifiers=true&identifier=${searchQuery}&q=${searchQuery}&startIndex=${startIndex}`);
        return response.data.pageOfResults;
    } catch (error) {
        console.error(error);
        return error.response;
    }
};

export const getPatient = async (uuid) => {
    try {
        const response = await axios.get(`${patientUrl}/${uuid}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return error.response;
    }
}