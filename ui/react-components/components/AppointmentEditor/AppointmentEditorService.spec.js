import {saveAppointment} from "./AppointmentEditorService";

jest.mock('../../api/appointmentsApi');
const appointmentsApi = require('../../api/appointmentsApi');
let appointmentsApiSpy;

describe('Appointment Editor Service', () => {
    beforeEach(() => {
        appointmentsApiSpy = jest.spyOn(appointmentsApi, 'saveOrUpdateAppointment');
    });
    afterEach(() => {
        appointmentsApiSpy.mockRestore();
    });

    it('should map providers as per payload', async () => {
        const appointment = {
            providers: [
                {
                    label: 'name1',
                    value: 'uuid1'
                },
                {
                    label: 'name2',
                    value: 'uuid2'
                }
            ]
        };
        const updatedAppointment = {
            providers: [
                {
                    name: 'name1',
                    uuid: 'uuid1'
                },
                {
                    name: 'name2',
                    uuid: 'uuid2'
                }
            ]
        };

        await saveAppointment(appointment);

        expect(appointmentsApiSpy).toHaveBeenCalledWith(updatedAppointment)
    });

    it('should return the response returned from saveOrUpdate Appointment', async () => {
        const appointment = {
            providers: [
                {
                    label: 'name1',
                    value: 'uuid1'
                },
                {
                    label: 'name2',
                    value: 'uuid2'
                }
            ]
        };

        const expectedResponse = {};
        appointmentsApiSpy.mockImplementation(() => expectedResponse);

        const response = await saveAppointment(appointment);

        expect(response).toEqual(expectedResponse);
    })
});
