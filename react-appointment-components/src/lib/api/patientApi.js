import axios from 'axios';
import {searchPatientUrl} from '../constants';

export const getPatientsByLocation = async (locationUuid, searchQuery, startIndex = 0) => {
    try {
        const response = await axios.get(`${searchPatientUrl}?loginLocationUuid=${locationUuid}&q=${searchQuery}&startIndex=${startIndex}`);
        return response.data.pageOfResults;
    } catch (error) {
        console.error(error);
    }
};
