import mockAxios from 'jest-mock-axios';
import {getConceptByUuid, searchConcepts} from './conceptApi';
import {conceptUrl} from '../config';

afterEach(() => {
    mockAxios.reset();
});

describe('Concept Api', () => {
    describe('getConceptByUuid', () => {
        it('should fetch concept by uuid', async () => {
            const conceptUuid = 'concept-uuid-123';
            const mockResponse = {
                uuid: 'concept-uuid-123',
                display: 'Fever',
                name: {
                    display: 'Fever',
                    uuid: 'name-uuid-123',
                    name: 'Fever',
                    locale: 'en',
                    localePreferred: true,
                    conceptNameType: 'FULLY_SPECIFIED'
                },
                datatype: {
                    uuid: 'datatype-uuid',
                    display: 'N/A'
                },
                conceptClass: {
                    uuid: 'class-uuid',
                    display: 'Diagnosis'
                },
                set: false,
                version: '1.0',
                retired: false
            };

            mockAxios.get.mockImplementationOnce(() =>
                Promise.resolve({
                    data: mockResponse
                })
            );

            const concept = await getConceptByUuid(conceptUuid);

            expect(mockAxios.get).toHaveBeenCalledWith(`${conceptUrl}/${conceptUuid}`);
            expect(concept).toEqual(mockResponse);
        });

        it('should handle error when fetching concept by uuid fails', async () => {
            const conceptUuid = 'invalid-uuid';
            const errorMessage = 'Network Error';
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            mockAxios.get.mockImplementationOnce(() =>
                Promise.reject(new Error(errorMessage))
            );

            await expect(getConceptByUuid(conceptUuid)).rejects.toThrow(errorMessage);
            expect(mockAxios.get).toHaveBeenCalledWith(`${conceptUrl}/${conceptUuid}`);
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Error fetching concept by conceptUuid : ',
                expect.any(Error)
            );

            consoleErrorSpy.mockRestore();
        });
    });

    describe('searchConcepts', () => {
        it('should search concepts by appointmentReasonConceptSet and searchTerm', async () => {
            const appointmentReasonConceptSet = 'concept-set-uuid';
            const searchTerm = 'fever';
            const mockResponse = {
                results: [
                    {
                        uuid: 'concept-1-uuid',
                        display: 'Fever',
                        name: {
                            display: 'Fever',
                            uuid: 'name-1-uuid',
                            name: 'Fever'
                        }
                    },
                    {
                        uuid: 'concept-2-uuid',
                        display: 'High Fever',
                        name: {
                            display: 'High Fever',
                            uuid: 'name-2-uuid',
                            name: 'High Fever'
                        }
                    }
                ]
            };

            mockAxios.get.mockImplementationOnce(() =>
                Promise.resolve({
                    data: mockResponse
                })
            );

            const concepts = await searchConcepts(appointmentReasonConceptSet, searchTerm);

            expect(mockAxios.get).toHaveBeenCalledWith(
                `${conceptUrl}?memberOf=${appointmentReasonConceptSet}&q=${searchTerm}`
            );
            expect(concepts).toEqual(mockResponse.results);
        });

        it('should return empty array when no concepts match search criteria', async () => {
            const appointmentReasonConceptSet = 'concept-set-uuid';
            const searchTerm = 'nonexistent';
            const mockResponse = {
                results: []
            };

            mockAxios.get.mockImplementationOnce(() =>
                Promise.resolve({
                    data: mockResponse
                })
            );

            const concepts = await searchConcepts(appointmentReasonConceptSet, searchTerm);

            expect(mockAxios.get).toHaveBeenCalledWith(
                `${conceptUrl}?memberOf=${appointmentReasonConceptSet}&q=${searchTerm}`
            );
            expect(concepts).toEqual([]);
        });

        it('should handle error when searching concepts fails', async () => {
            const appointmentReasonConceptSet = 'concept-set-uuid';
            const searchTerm = 'fever';
            const errorMessage = 'Server Error';
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            mockAxios.get.mockImplementationOnce(() =>
                Promise.reject(new Error(errorMessage))
            );

            await expect(searchConcepts(appointmentReasonConceptSet, searchTerm)).rejects.toThrow(errorMessage);
            expect(mockAxios.get).toHaveBeenCalledWith(
                `${conceptUrl}?memberOf=${appointmentReasonConceptSet}&q=${searchTerm}`
            );
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Error fetching concept by appointmentReasonConceptSet :',
                expect.any(Error)
            );

            consoleErrorSpy.mockRestore();
        });
    });
});
