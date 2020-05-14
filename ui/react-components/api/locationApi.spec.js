import mockAxios from "jest-mock-axios";
import {locationUrl} from "../config";
import {getAllByTag} from "./locationApi";

afterEach(() => {
    mockAxios.reset();
});

describe('Location Api', () => {
    it('should call location url with given tags and operator', async () =>{
        let tags = "Appointment Location";
        let operator = "some_operator";
        let mockResponse = {
            "results": [
                {
                    "address1": "address1",
                    "address2": "address2",
                    "address3": "address3",
                    "address4": "address4",
                    "name": "location1",
                    "uuid": "location1uuid"
                },
                {
                    "address1": "address1",
                    "address2": "address2",
                    "address3": "address3",
                    "address4": "address4",
                    "name": "location2",
                    "uuid": "location2uuid"
                }]
        };
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );

        let locationsByTag = await getAllByTag(tags, operator);

        expect(mockAxios.get)
            .toHaveBeenCalledWith(
                `${locationUrl}?operator=${operator}&s=byTags&tags=${tags}&v=default`);
        expect(locationsByTag).toEqual(mockResponse.results);
    });

    it('should call location url with default operator value when operator is not passed', async () =>{
        let tags = "Appointment Location";
        let mockResponse = {
            "results": [
                {
                    "address1": "address1",
                    "address2": "address2",
                    "address3": "address3",
                    "address4": "address4",
                    "name": "location1",
                    "uuid": "location1uuid"
                },
                {
                    "address1": "address1",
                    "address2": "address2",
                    "address3": "address3",
                    "address4": "address4",
                    "name": "location2",
                    "uuid": "location2uuid"
                }]
        };
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: mockResponse
            })
        );

        let locationsByTag = await getAllByTag(tags);

        expect(mockAxios.get)
            .toHaveBeenCalledWith(
                `${locationUrl}?operator=ALL&s=byTags&tags=${tags}&v=default`);
        expect(locationsByTag).toEqual(mockResponse.results);
    });
});
