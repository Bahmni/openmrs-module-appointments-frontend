import {renderWithReactIntl} from "../../utils/TestUtil";
import EditAppointment from "./EditAppointment";
import React from "react";
import {conflictsFor, getAppointment} from "../../api/appointmentsApi";
import {act, fireEvent, waitForElement} from "@testing-library/react";
import moment from "moment";


jest.mock('../../api/appointmentsApi');
jest.mock('../../api/recurringAppointmentsApi');
jest.mock('../../api/serviceApi');
const appointmentsApi = require('../../api/appointmentsApi');
const recurringAppointmentsApi = require('../../api/recurringAppointmentsApi');
const serviceApi = require('../../api/serviceApi');
let appointmentsApiSpy;
let recurringAppointmentsApiSpy;
let appointmentsUpdateApiSpy;
let getAllServicesSpy;
let conflictsForSpy;
let recurringConflictsApiSpy;

describe('Edit Appointment', () => {
    const flushPromises = () => new Promise(setImmediate);

    beforeEach(() => {
        appointmentsApiSpy = jest.spyOn(appointmentsApi, 'getAppointment');
        recurringAppointmentsApiSpy = jest.spyOn(recurringAppointmentsApi, 'getRecurringAppointment');
        appointmentsUpdateApiSpy = jest.spyOn(appointmentsApi, 'saveOrUpdateAppointment');
        getAllServicesSpy = jest.spyOn(serviceApi, 'getAllServices');
        conflictsForSpy = jest.spyOn(appointmentsApi, 'conflictsFor');
        recurringConflictsApiSpy = jest.spyOn(recurringAppointmentsApi, 'recurringConflictsFor');

    });
    afterEach(() => {
        appointmentsApiSpy.mockRestore();
        recurringAppointmentsApiSpy.mockRestore();
        appointmentsUpdateApiSpy.mockRestore();
        getAllServicesSpy.mockRestore();
        conflictsForSpy.mockRestore();
        recurringConflictsApiSpy.mockRestore();
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
        getByTextInDom('11:00 pm');
        getByTextInDom('11:30 pm');
        expect(containerInDom.querySelectorAll('.rc-time-picker-input')[0].value).toBe('11:00 pm');
        expect(containerInDom.querySelectorAll('.rc-time-picker-input')[1].value).toBe('11:30 pm');
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
        getByTextInDom('11:00 pm');
        getByTextInDom('11:30 pm');
        getByTextInDom('2nd');
        getByTextInDom('Day');
        expect(getByTestIdInDom('input-box').value).toBe('3');
        getByTextInDom('Occurrences');
        expect(containerInDom.querySelectorAll('.rc-time-picker-input')[0].value).toBe('11:00 pm');
        expect(containerInDom.querySelectorAll('.rc-time-picker-input')[1].value).toBe('11:30 pm');
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
        getByTextInDom('11:00 pm');
        getByTextInDom('11:30 pm');
        getByTextInDom('2nd');
        getByTextInDom('Week');
        getByTextInDom('Series ends on');
        getByTextInDom('11th December 9999');
        expect(getByTestIdInDom('SUNDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('MONDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('TUESDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('WEDNESDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('THURSDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('FRIDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('SATURDAY').hasAttribute('disabled')).toBeTruthy();
        expect(containerInDom.querySelectorAll('.rc-time-picker-input')[0].value).toBe('11:00 pm');
        expect(containerInDom.querySelectorAll('.rc-time-picker-input')[1].value).toBe('11:30 pm');
        getByTextInDom('comments');
        getByTextInDom('Update');
        getByTextInDom('Cancel');
    });

    it('should recurring plan component', () => {
        const {getByText} = renderWithReactIntl(<EditAppointment appointmentUuid={'appt-uuid'} isRecurring="true"/>);
        getByText('Plan');
        getByText('Recurring Appointment');
    });

    it('should check the walk in appointment when clicked', () => {
        const {container} = renderWithReactIntl(<EditAppointment isRecurring={false} appointmentUuid="appt-uuid"/>);
        const walkInCheckBox = container.querySelectorAll('.rc-checkbox-input')[1];
        fireEvent.click(walkInCheckBox);
        expect(walkInCheckBox.checked).toBeTruthy();
        fireEvent.click(walkInCheckBox);
        expect(walkInCheckBox.checked).toBeFalsy();
    });

    it('should check for conflicts on click of update of single appointment', async () => {
        let getByTextInDom = undefined;
        let containerInDom = undefined;
        let getAllByTitleInDom = undefined;
        let getByTestIdInDom = undefined;
        const config = {
            "enableSpecialities": true
        };
        act(() => {
            const {getByText, container, getAllByTitle, getByTestId} = renderWithReactIntl(<EditAppointment
                appointmentUuid={'36fdc60e-7ae5-4708-9fcc-8c98daba0ca9'} isRecurring="false" appConfig={config}/>);
            getByTextInDom = getByText;
            containerInDom = container;
            getAllByTitleInDom = getAllByTitle;
            getByTestIdInDom = getByTestId;
        });
        await flushPromises();
        getByTextInDom('Physiotherapy OPD');
        //change service
        const targetService = 'Dressing';
        const inputBoxService = containerInDom.querySelectorAll('.react-select__input input')[1];
        fireEvent.change(inputBoxService, {target: {value: "Dre"}});
        await waitForElement(() => (containerInDom.querySelector('.react-select__menu')));
        const optionService = getByTextInDom(targetService);
        fireEvent.click(optionService);
        let singleValueService;
        await waitForElement(
            () =>
                (singleValueService = containerInDom.querySelector(
                    '.react-select__single-value'
                ))
        );

        fireEvent.click(getByTextInDom('Update'));

        expect(conflictsForSpy).toHaveBeenCalledTimes(1);
    });

    it('should not check for conflicts and render update options on click of update of recurring appointments', async () => {
        let getByTextInDom = undefined;
        let containerInDom = undefined;
        let getAllByTitleInDom = undefined;
        let getByTestIdInDom = undefined;
        const config = {
            "enableSpecialities": true
        };
        act(() => {
            const {getByText, container, getAllByTitle, getByTestId} = renderWithReactIntl(<EditAppointment
                appointmentUuid={'day'} isRecurring="true" appConfig={config}/>);
            getByTextInDom = getByText;
            containerInDom = container;
            getAllByTitleInDom = getAllByTitle;
            getByTestIdInDom = getByTestId;
        });
        await flushPromises();
        getByTextInDom('Physiotherapy OPD');
        // change service
        const targetService = 'Dressing';
        const inputBoxService = containerInDom.querySelectorAll('.react-select__input input')[1];
        fireEvent.change(inputBoxService, {target: {value: "Dre"}});
        await waitForElement(() => (containerInDom.querySelector('.react-select__menu')));
        const optionService = getByTextInDom(targetService);
        fireEvent.click(optionService);
        let singleValueService;
        await waitForElement(
            () =>
                (singleValueService = containerInDom.querySelector(
                    '.react-select__single-value'
                ))
        );

        fireEvent.click(getByTextInDom('Update'));

        expect(containerInDom.querySelector('.updateOptions')).not.toBeNull();
        expect(recurringConflictsApiSpy).toHaveBeenCalledTimes(0);

    });

    it.skip('should not render update options and check for conflicts when startDate is edited for recurring appointment', async () => {
        let getByTextInDom = undefined;
        let containerInDom = undefined;
        let getByTestIdInDom = undefined;
        let getAllByTitleInDom = undefined;
        const config = {
            "enableSpecialities": true
        };
        act(() => {
            const {getByText, container, getByTestId, getAllByTitle} = renderWithReactIntl(<EditAppointment
                appointmentUuid={'DAY'} isRecurring="true" appConfig={config}/>);
            getByTextInDom = getByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
            getAllByTitleInDom = getAllByTitle;
        });
        await flushPromises();

        //change date
        const date = moment();
        const year = date.format('YYYY');
        const month = date.format('MMM');
        const tomorrow = date.format("MMMM D, YYYY");

        fireEvent.click(containerInDom.querySelector('[title="Choose a year"]'));
        fireEvent.click(containerInDom.querySelector(`[title="${year}"]`));
        fireEvent.click(containerInDom.querySelector('[title="Choose a month"]'));
        fireEvent.click(containerInDom.querySelector(`[title="${month}"]`));
        fireEvent.click(containerInDom.querySelector(`[title="${tomorrow}"]`));
        fireEvent.click(getByTextInDom('Update'));

        expect(containerInDom.querySelector('.updateOptions')).toBeNull();
        expect(recurringConflictsApiSpy).toHaveBeenCalledTimes(1);
    });

    it('should not render update options and check for conflicts when occurrences is edited for recurring appointment', async () => {
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

        getByTextInDom('Occurrences');

        //change occurrences
        fireEvent.click(getByTestIdInDom('left-arrow'));
        expect(containerInDom.querySelector('.updateOptions')).toBeNull();

        fireEvent.click(getByTestIdInDom('right-arrow'));
        fireEvent.click(getByTextInDom('Update'));

        expect(containerInDom.querySelector('.updateOptions')).not.toBeNull();
        expect(recurringConflictsApiSpy).toHaveBeenCalledTimes(0);

    });

    it('should display error message when start date is cleared and click on update', async () => {
        let getByTextInDom = undefined;
        let containerInDom = undefined;
        let getByTestIdInDom = undefined;
        let getAllByTitleInDom = undefined;
        const config = {
            "enableSpecialities": true
        };
        act(() => {
            const {getByText, container, getByTestId, getAllByTitle} = renderWithReactIntl(<EditAppointment
                appointmentUuid={'DAY'} isRecurring="false" appConfig={config}/>);
            getByTextInDom = getByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
            getAllByTitleInDom = getAllByTitle;
        });
        await flushPromises();

        //clear date
        fireEvent.click(containerInDom.querySelector('.rc-calendar-clear-btn'));

        fireEvent.click(getByTextInDom('Update'));
        getByTextInDom('Please select date');

        expect(conflictsForSpy).not.toHaveBeenCalled();
    });

    it('should display error message when start time or end time is cleared', async () => {
        let getByTextInDom = undefined;
        let getAllByTextInDom = undefined;
        let containerInDom = undefined;
        let getByTestIdInDom = undefined;
        let getAllByTitleInDom = undefined;
        const config = {
            "enableSpecialities": true
        };
        act(() => {
            const {getByText, getAllByText, container, getByTestId, getAllByTitle} = renderWithReactIntl(<EditAppointment
                appointmentUuid={'DAY'} isRecurring="true" appConfig={config}/>);
            getByTextInDom = getByText;
            getAllByTextInDom = getAllByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
            getAllByTitleInDom = getAllByTitle;
        });
        await flushPromises();

        getByTextInDom('11:00 pm');
        getByTextInDom('11:30 pm');
        //clear time
        containerInDom.querySelectorAll('.rc-time-picker-clear-icon').forEach(a => fireEvent.click(a))

        expect(getAllByTextInDom('Please select time').length).toBe(2);
        expect(conflictsForSpy).not.toHaveBeenCalled();
    });

    it('should display error message when occurrences is cleared', async () => {
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

        getByTextInDom('Occurrences');

        //clear occurrences
        const zeroOccurrences = "0";
        const inputBoxService = getByTestIdInDom("input-box");
        fireEvent.change(inputBoxService, {target: {value: zeroOccurrences}});

        getByTextInDom('Please select valid occurrences');
        expect(conflictsForSpy).not.toHaveBeenCalled();

    });
});
