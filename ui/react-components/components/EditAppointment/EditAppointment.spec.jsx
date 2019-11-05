import {renderWithReactIntl} from "../../utils/TestUtil";
import EditAppointment from "./EditAppointment";
import React from "react";
import {getAppointmentByUuid} from "../../api/appointmentsApi";
import {act} from "@testing-library/react";

jest.mock('../../api/appointmentsApi');
jest.mock('../../api/recurringAppointmentsApi');
const appointmentsApi = require('../../api/appointmentsApi');
const recurringAppointmentsApi = require('../../api/recurringAppointmentsApi');
let appointmentsApiSpy;
let recurringAppointmentsApiSpy;

describe('Edit Appointment', () => {
    const flushPromises = () => new Promise(setImmediate);

    beforeEach(() => {
        appointmentsApiSpy = jest.spyOn(appointmentsApi, 'getAppointmentByUuid');
        recurringAppointmentsApiSpy = jest.spyOn(recurringAppointmentsApi, 'getRecurringAppointmentByUuid');
    });
    afterEach(() => {
        appointmentsApiSpy.mockRestore();
        recurringAppointmentsApiSpy.mockRestore();
    });

    it('should call getAppointmentByUuid when isRecurring is false', () => {
        renderWithReactIntl(<EditAppointment appointmentUuid={'36fdc60e-7ae5-4708-9fcc-8c98daba0ca9'}
                                             isRecurring={false}/>);
        expect(appointmentsApiSpy).toHaveBeenCalledTimes(1);
    });

    it('should call getRecurringAppointmentByUuid when isRecurring is false', () => {
        renderWithReactIntl(<EditAppointment appointmentUuid={'36fdc60e-7ae5-4708-9fcc-8c98daba0ca9'}
                                             isRecurring={true}/>);
        expect(recurringAppointmentsApiSpy).toHaveBeenCalledTimes(1);
    });

    //TODO Warnings while running tests
    it('should render patient, service, service type, speciality and location details coming from response', async () => {
        let getByTextInDom = undefined;
        const config = {
            "enableSpecialities": true
        };
        act(() => {
            const {getByText} = renderWithReactIntl(<EditAppointment
                appointmentUuid={'36fdc60e-7ae5-4708-9fcc-8c98daba0ca9'} isRecurring={false} appConfig={config}/>);
            getByTextInDom = getByText;
        });
        await flushPromises();
        getByTextInDom('9DEC81BF 9DEC81C6 (IQ1114)');
        getByTextInDom('Physiotherapy OPD');
        getByTextInDom('1 session');
        getByTextInDom('Operating Theatre');
        getByTextInDom('test speciality');
    });

    it('should recurring plan component', () => {
        const {getByText} = renderWithReactIntl(<EditAppointment appointmentUuid={'appt-uuid'} isRecurring={true}/>);
        getByText('Plan');
        getByText('Recurring Appointment');
    })
});

