import axios from 'axios';
import {locationUrl} from "../config";

export const getAllByTag = async (tags, operator) => {
    try {
        const response = await axios.get(`${locationUrl}?operator=${operator || "ALL"}&s=byTags&tags=${tags}&v=default`);
        return response.data.results;
    } catch (error) {
        console.error(error);
        return error.response;
    }
};
