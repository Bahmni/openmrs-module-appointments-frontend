import axios from 'axios';
import {conceptUrl} from "../config";

export const getConceptByUuid = async (conceptUuid) => {
    try {
        const response = await axios.get(`${conceptUrl}/${conceptUuid}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching concept by conceptUuid : ', error);
        throw error;
    }
};

export const searchConcepts = async (appointmentReasonConceptSet, searchTerm) => {
    try {
        const response = await axios.get(`${conceptUrl}?memberOf=${appointmentReasonConceptSet}&q=${searchTerm}`);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching concept by appointmentReasonConceptSet :', error);
        throw error;
    }
};
