import mockAxios from 'jest-mock-axios';
import {getAppConfigs} from './configApi';
import {BAHMNI_CONFIG_URL, IMPLEMENTATION_CONFIG_URL} from '../config';

afterEach(() => {
    mockAxios.reset();
});
const appName = 'appointments';
const APP_FILE = 'app.json';
describe('Bahmni Config Api', () => {
    it('should fetch the bahmni app configs', async () => {
        let mockResponse = {
            "id": "bahmni.appointments",
            "description": "Bahmni Appointments Scheduling App",
            "extensionPoints": [
                {
                    "id": "org.bahmni.appointments",
                    "description": "Bahmni Admin Page"
                }
            ],
            "config": {
                "enableSpecialities": false,
                "startOfWeek": 1
            }
        };
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );

        const appConfigs = await getAppConfigs({appName});
        expect(mockAxios.get)
            .toHaveBeenCalledWith(
                `${BAHMNI_CONFIG_URL}/${appName}/${APP_FILE}`);
    });

    it('should fetch the bahmni implementation app configs when shouldOverRideConfig is true', async () => {
        let bahmniConfigMockResponse = {
            shouldOverRideConfig: true,
            "id": "bahmni.appointments",
            "description": "Bahmni Appointments Scheduling App",
            "extensionPoints": [
                {
                    "id": "org.bahmni.appointments",
                    "description": "Bahmni Admin Page"
                }
            ],
            "config": {
                "enableSpecialities": false,
                "startOfWeek": 1
            }
        };

        let implemantationConfigMockResponse = {
            "id": "bahmni.appointments",
            "description": "Bahmni Appointments Scheduling App",
            "extensionPoints": [
                {
                    "id": "org.bahmni.appointments",
                    "description": "Bahmni Admin Page"
                }
            ],
            "config": {
                "enableSpecialities": true,
                "startOfWeek": 2
            }
        };
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: bahmniConfigMockResponse
            })
        ).mockImplementationOnce(() =>
            Promise.resolve({
                data: implemantationConfigMockResponse
            })
        );

        const appConfigs = await getAppConfigs({appName});
        expect(mockAxios.get)
            .toHaveBeenCalledWith(
                `${BAHMNI_CONFIG_URL}/${appName}/${APP_FILE}`);

        expect(mockAxios.get)
            .toHaveBeenCalledWith(
                `${IMPLEMENTATION_CONFIG_URL}/${appName}/${APP_FILE}`);
        expect(appConfigs.config).toEqual(implemantationConfigMockResponse.config);
    });

    it('should not fetch the bahmni implementation app configs when shouldOverRideConfig is not specified', async () => {
        let bahmniConfigMockResponse = {
            "id": "bahmni.appointments",
            "description": "Bahmni Appointments Scheduling App",
            "extensionPoints": [
                {
                    "id": "org.bahmni.appointments",
                    "description": "Bahmni Admin Page"
                }
            ],
            "config": {
                "enableSpecialities": false,
                "startOfWeek": 1
            }
        };

        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: bahmniConfigMockResponse
            })
        );

        const appConfigs = await getAppConfigs({appName});
        expect(mockAxios.get)
            .toHaveBeenCalledWith(
                `${BAHMNI_CONFIG_URL}/${appName}/${APP_FILE}`);

        expect(mockAxios.get)
            .not.toHaveBeenCalledWith(
                `${IMPLEMENTATION_CONFIG_URL}/${appName}/${APP_FILE}`);
        expect(appConfigs.config).toEqual(bahmniConfigMockResponse.config);
    });
});
