import axios from 'axios';
import {locationUrl} from "../constants";

export const getAllByTag = async (tags, operator) => {
    try {
        const response = await axios.get(`${locationUrl}?operator=${operator || "ALL"}&s=byTags&tags=${tags}&v=default`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
