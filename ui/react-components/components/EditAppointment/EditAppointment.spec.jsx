import {renderWithReactIntl} from "../../utils/TestUtil";
import EditAppointment from "./EditAppointment";
import React from "react";
import {getAppointment} from "../../api/appointmentsApi";
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
        appointmentsApiSpy = jest.spyOn(appointmentsApi, 'getAppointment');
        recurringAppointmentsApiSpy = jest.spyOn(recurringAppointmentsApi, 'getRecurringAppointment');
    });
    afterEach(() => {
        appointmentsApiSpy.mockRestore();
        recurringAppointmentsApiSpy.mockRestore();
    });

    it('should call getAppointment when isRecurring is false', () => {
        renderWithReactIntl(<EditAppointment appointmentUuid={'36fdc60e-7ae5-4708-9fcc-8c98daba0ca9'}
                                             isRecurring="false"/>);
        expect(appointmentsApiSpy).toHaveBeenCalledTimes(1);
    });

    it('should call getRecurringAppointment when isRecurring is false', () => {
        renderWithReactIntl(<EditAppointment appointmentUuid={'36fdc60e-7ae5-4708-9fcc-8c98daba0ca9'}
                                             isRecurring="true"/>);
        expect(recurringAppointmentsApiSpy).toHaveBeenCalledTimes(1);
    });

    //TODO Warnings while running tests
    it('should render appointment details coming from response', async () => {
        let getByTextInDom = undefined;
        let containerInDom = undefined;
        const config = {
            "enableSpecialities": true
        };
        act(() => {
            const {getByText, container} = renderWithReactIntl(<EditAppointment
                appointmentUuid={'36fdc60e-7ae5-4708-9fcc-8c98daba0ca9'} isRecurring="false" appConfig={config}/>);
            getByTextInDom = getByText;
            containerInDom = container;
        });
        await flushPromises();
        getByTextInDom('9DEC81BF 9DEC81C6 (IQ1114)');
        getByTextInDom('Physiotherapy OPD');
        getByTextInDom('1 session');
        getByTextInDom('Operating Theatre');
        getByTextInDom('test speciality');
        getByTextInDom('to');
        getByTextInDom('04:30 am');
        getByTextInDom('05:00 am');
        expect(containerInDom.querySelectorAll('.rc-time-picker-input')[0].value).toBe('4:30 am');
        expect(containerInDom.querySelectorAll('.rc-time-picker-input')[1].value).toBe('5:00 am');
        getByTextInDom('comments');
        getByTextInDom('Update');
        getByTextInDom('Cancel');
    });

    it('should render daily recurring appointment details coming from response', async () => {
        let getByTextInDom = undefined;
        let containerInDom = undefined;
        let getByTestIdInDom = undefined;
        const config = {
            "enableSpecialities": true
        };
        act(() => {
            const {getByText, container, getByTestId} = renderWithReactIntl(<EditAppointment
                appointmentUuid={'DAY'} isRecurring="true" appConfig={config}/>);
            getByTextInDom = getByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
        });
        await flushPromises();
        getByTextInDom('9DEC81BF 9DEC81C6 (IQ1114)');
        getByTextInDom('Physiotherapy OPD');
        getByTextInDom('1 session');
        getByTextInDom('Operating Theatre');
        getByTextInDom('test speciality');
        getByTextInDom('to');
        getByTextInDom('04:30 am');
        getByTextInDom('05:00 am');
        getByTextInDom('2nd');
        getByTextInDom('Day');
        expect(getByTestIdInDom('input-box').value).toBe('3');
        getByTextInDom('Occurrences');
        expect(containerInDom.querySelectorAll('.rc-time-picker-input')[0].value).toBe('4:30 am');
        expect(containerInDom.querySelectorAll('.rc-time-picker-input')[1].value).toBe('5:00 am');
        getByTextInDom('comments');
        getByTextInDom('Update');
        getByTextInDom('Cancel');
    });

    it('should render weekly recurring appointment details coming from response', async () => {
        let getByTextInDom = undefined;
        let containerInDom = undefined;
        let getByTestIdInDom = undefined;
        const config = {
            "enableSpecialities": true
        };
        act(() => {
            const {getByText, container, getByTestId} = renderWithReactIntl(<EditAppointment
                appointmentUuid={'WEEK'} isRecurring="true" appConfig={config}/>);
            getByTextInDom = getByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
        });
        await flushPromises();
        getByTextInDom('9DEC81BF 9DEC81C6 (IQ1114)');
        getByTextInDom('Physiotherapy OPD');
        getByTextInDom('1 session');
        getByTextInDom('Operating Theatre');
        getByTextInDom('test speciality');
        getByTextInDom('to');
        getByTextInDom('04:30 am');
        getByTextInDom('05:00 am');
        getByTextInDom('2nd');
        getByTextInDom('Week');
        getByTextInDom('New end date');
        getByTextInDom('11th October 2019');
        expect(getByTestIdInDom('SUNDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('MONDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('TUESDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('WEDNESDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('THURSDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('FRIDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('SATURDAY').hasAttribute('disabled')).toBeTruthy();
        expect(containerInDom.querySelectorAll('.rc-time-picker-input')[0].value).toBe('4:30 am');
        expect(containerInDom.querySelectorAll('.rc-time-picker-input')[1].value).toBe('5:00 am');
        getByTextInDom('comments');
        getByTextInDom('Update');
        getByTextInDom('Cancel');
    });

    it('should recurring plan component', () => {
        const {getByText} = renderWithReactIntl(<EditAppointment appointmentUuid={'appt-uuid'} isRecurring="true"/>);
        getByText('Plan');
        getByText('Recurring Appointment');
    });
});