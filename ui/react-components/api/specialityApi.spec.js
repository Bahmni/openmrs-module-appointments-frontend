import mockAxios from "jest-mock-axios";
import {specialityUrl} from "../config";
import {getAllSpecialities} from "./specialityApi";

afterEach(() => {
    mockAxios.reset();
});

describe('Speciality service', () => {
    it('should return specialities', async () => {
        let mockResponse = [
            {
                "name": "SpecialityOne",
                "uuid": "SpecialityOneUuid"
            },
            {
                "name": "SpecialityTwo",
                "uuid": "SpecialityTwoUuid"
            }
        ];
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );

        let specialities = await getAllSpecialities();

        expect(mockAxios.get).toHaveBeenCalledWith(specialityUrl);
        expect(specialities).toEqual(mockResponse);
    });
});
