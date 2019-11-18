import mockAxios from 'jest-mock-axios';
import {getTranslations} from './translationsApi';
import {BAHMNI_CONFIG_URL} from "../constants";
afterEach(() => {
    mockAxios.reset();
});
const appName = 'appointments';
const i18nBahmniConfigPath = '/bahmni_config/openmrs/i18n/';
const baseLocaleUrl = 'i18n/';
const fileURL = `${appName}/locale_en.json`;
describe('Translations Api', () => {
    it('should fetch the transaltions and merge from bahmni config and local when should merge is true', async () => {
        let loaclMockResponse = {
            "LOCATION_KEY": "Location",
            "BED_NUMBER_KEY": "Bed Number",
            "APPOINTMENT_ADDITIONAL_INFO": "Bed Details",
            "PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PATIENT": "Patient ID",
            "dropdown.no-options-message": "Type to search"
        };

        let bahmniConfigMockResponse = {
            "LOCATION_KEY": "Location",
            "BED_NUMBER_KEY": "Bed Number",
            "APPOINTMENT_ADDITIONAL_INFO": "Bed Details",
            "PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PATIENT": "Test",
            "dropdown.no-options-message": "Type Test"
        };

        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: loaclMockResponse
            })
        ).mockImplementationOnce(() =>
            Promise.resolve({
                data: bahmniConfigMockResponse
            })
        );

        const translations = await getTranslations({appName, locale: 'en'});
        expect(mockAxios.get)
            .toHaveBeenCalledWith(
                `${baseLocaleUrl}${fileURL}`);

        expect(mockAxios.get)
            .toHaveBeenCalledWith(
                '/bahmni_config/openmrs/i18n/appointments/locale_en.json');

        expect(translations).toEqual(bahmniConfigMockResponse);
    });

    it('should fetch the transaltions and not nege from bahmni config and local when should merge is false', async () => {
        let loaclMockResponse = {
            "LOCATION_KEY": "Location",
            "BED_NUMBER_KEY": "Bed Number",
            "APPOINTMENT_ADDITIONAL_INFO": "Bed Details",
            "PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PATIENT": "Patient ID",
        };

        let bahmniConfigMockResponse = {
            "dropdown.no-options-message": "Type Test"
        };

        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: loaclMockResponse
            })
        ).mockImplementationOnce(() =>
            Promise.resolve({
                data: bahmniConfigMockResponse
            })
        );

        const translations = await getTranslations({appName, locale: 'en', shouldMerge: false});
        expect(mockAxios.get)
            .toHaveBeenCalledWith(
                `${baseLocaleUrl}${fileURL}`);

        expect(mockAxios.get)
            .toHaveBeenCalledWith(
                '/bahmni_config/openmrs/i18n/appointments/locale_en.json');

        expect(translations).toEqual([{
            "APPOINTMENT_ADDITIONAL_INFO": "Bed Details",
            "BED_NUMBER_KEY": "Bed Number",
            "LOCATION_KEY": "Location",
            "PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PATIENT": "Patient ID"
        }, {"dropdown.no-options-message": "Type Test"}]);
    });
});
