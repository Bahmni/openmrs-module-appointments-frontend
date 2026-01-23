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

export const getConceptUuidByName = async (conceptName) => {
    try {
        const response = await axios.get(
            `${conceptUrl}?s=byFullySpecifiedName&name=${encodeURIComponent(conceptName)}&v=custom:(uuid)`
        );

        return response.data.results[0].uuid;
    } catch (error) {
        console.error('Error fetching concept UUID by name:', error);
        throw error;
    }
};
