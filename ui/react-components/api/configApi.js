import axios from 'axios';
import {BAHMNI_CONFIG_URL, IMPLEMENTATION_CONFIG_URL} from '../config';
import {mergeObjects} from '../utils/MergeObjectUtil';

const APP_FILE = 'app.json';

const loadConfig = async (url) => {
    try {
        return await axios.get(url);
    } catch (e) {
        return;
    }
};

const loadBahmniConfigData = async ({appName}) => {
    return await loadConfig(`${BAHMNI_CONFIG_URL}/${appName}/${APP_FILE}`);
};

const loadImplementationConfigData = async ({appName}) => {
    return await loadConfig(`${IMPLEMENTATION_CONFIG_URL}/${appName}/${APP_FILE}`);
};

export const getAppConfigs = async ({appName}) => {
    const bahmniConfig = await loadBahmniConfigData({appName});
    if (bahmniConfig && bahmniConfig.data.shouldOverRideConfig) {
        const implementationConfig = await loadImplementationConfigData({appName});
        if (implementationConfig) { return mergeObjects(bahmniConfig.data, implementationConfig.data); }
    }
    return bahmniConfig.data;
};

export const getFromGlobalProperty = async (propertyName) => {
    try {
        const response = await axios.get(`/openmrs/ws/rest/v1/bahmnicore/sql/globalproperty?property=${propertyName}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
