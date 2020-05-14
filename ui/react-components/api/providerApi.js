import axios from 'axios';
import {availableForAppointments} from "../constants";
import {providerParams, providerUrl} from "../config";
import _ from 'lodash';

export const getAllProviders = async () => {
    try {
        const response = await axios.get(`${providerUrl}?${providerParams}`);
        return _.filter(response.data.results, function (provider) {
            return _.find(provider.attributes, function (attribute) {
                return !attribute.voided && !provider.retired
                    && attribute.value
                    && attribute.attributeType.display === availableForAppointments;
            });
        });
    } catch(error) {
        console.error(error);
        return error.response;
    }
}
