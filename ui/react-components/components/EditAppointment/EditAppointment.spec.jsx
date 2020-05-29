import {renderWithReactIntl} from "../../utils/TestUtil";
import EditAppointment from "./EditAppointment";
import React from "react";
import {conflictsFor, getAppointment} from "../../api/appointmentsApi";
import {act, fireEvent, waitForElement} from "@testing-library/react";
import moment from "moment";
import {AppContext} from "../AppContext/AppContext";


jest.mock('../../api/appointmentsApi');
jest.mock('../../api/recurringAppointmentsApi');
jest.mock('../../api/serviceApi');
jest.mock('../../api/providerApi');
const appointmentsApi = require('../../api/appointmentsApi');
const recurringAppointmentsApi = require('../../api/recurringAppointmentsApi');
const serviceApi = require('../../api/serviceApi');
const providerApi = require('../../api/providerApi');
let appointmentsApiSpy;
let recurringAppointmentsApiSpy;
let appointmentsUpdateApiSpy;
let getAllServicesSpy;
let conflictsForSpy;
let recurringConflictsApiSpy;
let getAllProvidersSpy;

const Wrapper = (props) => {
    return  <div>
        {props.children}
    </div>
}

const clickOnFirstDayOfNextMonth = (container) => {
    const nextMonth = moment().add(1, 'months');
    const nextButton = container.querySelector('.react-datepicker__navigation--next');
    fireEvent.click(nextButton);
    fireEvent.click(container.querySelector('.react-datepicker__day--001'));
    return nextMonth;
}

const flushPromises = () => new Promise(setImmediate);
describe('Edit Appointment', () => {

    beforeEach(() => {
        appointmentsApiSpy = jest.spyOn(appointmentsApi, 'getAppointment');
        recurringAppointmentsApiSpy = jest.spyOn(recurringAppointmentsApi, 'getRecurringAppointment');
        appointmentsUpdateApiSpy = jest.spyOn(appointmentsApi, 'saveOrUpdateAppointment');
        getAllServicesSpy = jest.spyOn(serviceApi, 'getAllServices');
        conflictsForSpy = jest.spyOn(appointmentsApi, 'conflictsFor');
        recurringConflictsApiSpy = jest.spyOn(recurringAppointmentsApi, 'recurringConflictsFor');
        getAllProvidersSpy = jest.spyOn(providerApi, 'getAllProviders');
    });
    afterEach(() => {
        appointmentsApiSpy.mockRestore();
        recurringAppointmentsApiSpy.mockRestore();
        appointmentsUpdateApiSpy.mockRestore();
        getAllServicesSpy.mockRestore();
        conflictsForSpy.mockRestore();
        recurringConflictsApiSpy.mockRestore();
        getAllProvidersSpy.mockRestore();
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
            "enableSpecialities": true,
            "enableServiceTypes": true
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
            "enableSpecialities": true,
            "enableServiceTypes": true
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
            "enableSpecialities": true,
            "enableServiceTypes": true
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
        const {container} = renderWithReactIntl(<EditAppointment isRecurring={false} appointmentUuid="36fdc60e-7ae5-4708-9fcc-8c98daba0ca9"/>);
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
            "enableSpecialities": false
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
        fireEvent.blur(inputBoxService);
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
            "enableSpecialities": false
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
        fireEvent.blur(inputBoxService);
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

    it('should not render update options and check for conflicts when startDate is edited for recurring appointment', async () => {
        let getByTextInDom = undefined;
        let containerInDom = undefined;
        let getByTestIdInDom = undefined;
        let getAllByTitleInDom = undefined;
        let getByPlaceholderTextInDom = undefined;
        const config = {
            "enableSpecialities": true
        };
        act(() => {
            const {getByText, container, getByTestId, getAllByTitle, getByPlaceholderText} = renderWithReactIntl(<EditAppointment
                appointmentUuid={'DAY'} isRecurring="true" appConfig={config}/>);
            getByTextInDom = getByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
            getAllByTitleInDom = getAllByTitle;
            getByPlaceholderTextInDom= getByPlaceholderText;
        });
        await flushPromises();

        clickOnFirstDayOfNextMonth(containerInDom);
        fireEvent.click(getByTextInDom('Update'));

        expect(containerInDom.querySelector('.updateOptions')).toBeNull();
        expect(conflictsForSpy).toHaveBeenCalledTimes(1);
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
                appointmentUuid={"36fdc60e-7ae5-4708-9fcc-8c98daba0ca9"} isRecurring="false" appConfig={config}/>);
            getByTextInDom = getByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
            getAllByTitleInDom = getAllByTitle;
        });
        await flushPromises();

        //clear date
        fireEvent.click(getByTestIdInDom('clear-date-input'));

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
                appointmentUuid={"36fdc60e-7ae5-4708-9fcc-8c98daba0ca9"} isRecurring="true" appConfig={config}/>);
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

    it('should not display providers with cancelled status', async () => {
        let getByTextInDom = undefined;
        let containerInDom = undefined;
        let queryByTextInDom = undefined;

        const config = {
            "enableSpecialities": true,
            "enableServiceTypes": true
        };
        act(() => {
            const {getByText, container, queryByText} = renderWithReactIntl(<EditAppointment
                appointmentUuid={'36fdc60e-7ae5-4708-9fcc-8c98daba0ca9'} isRecurring="false" appConfig={config}/>);
            getByTextInDom = getByText;
            containerInDom = container;
            queryByTextInDom = queryByText;
        });
        await flushPromises();
        getByTextInDom("Abeer Abusamour");
        expect(queryByTextInDom("Provider Two")).toBeNull();
    });

    it('should  display selected providers from drop down', async () => {
        let getByTextInDom = undefined;
        let containerInDom = undefined;
        let queryByTextInDom = undefined;

        const config = {
            "enableServiceTypes": true,
            "maxAppointmentProviders": 2
        };
        act(() => {
            const {getByText, container, queryByText} = renderWithReactIntl(<EditAppointment
                appointmentUuid={'36fdc60e-7ae5-4708-9fcc-8c98daba0ca9'} isRecurring="false" appConfig={config}/>);
            getByTextInDom = getByText;
            containerInDom = container;
            queryByTextInDom = queryByText;
        });
        await flushPromises();
        let selectedProvider = "Provider Two";

        const inputBox = containerInDom.querySelectorAll('.react-select__input input')[4];
        fireEvent.change(inputBox, {target: {value: "Two"}});
        await waitForElement(() => (containerInDom.querySelector('.react-select__menu')));

        const optionOne = getByTextInDom(selectedProvider);
        fireEvent.click(optionOne);
        getByTextInDom("Provider Two");
    });

    it('should display Invalid date and Invalid day when end date is cleared', async () => {
        let getByTextInDom = undefined;
        let containerInDom = undefined;
        let getByTestIdInDom = undefined;
        let baseElementInDom = undefined;
        let getAllByTestIdInDom= undefined
        const config = {
            "enableSpecialities": true,
            "enableServiceTypes": true
        };
        act(() => {
            const {getByText, container, getByTestId, baseElement, getAllByTestId} = renderWithReactIntl(<Wrapper><EditAppointment
                appointmentUuid={'WEEK'} isRecurring="true" appConfig={config}/></Wrapper>);
            getByTextInDom = getByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
            baseElementInDom = baseElement;
            getAllByTestIdInDom = getAllByTestId;
        });
        await flushPromises();
        const calendar = getByTestIdInDom('calendar-icon');
        fireEvent.click(calendar);
        const clearDateInputButton = getAllByTestIdInDom('clear-date-input')[1];
        fireEvent.click(clearDateInputButton);

        getByTextInDom('Invalid date');
        getByTextInDom('Invalid day');
    });

    it('should display datepicker with appointment start date for non recurring appointment', async() =>{
        let getByTextInDom = undefined;
        let containerInDom = undefined;
        let getByPlaceholderTextInDom= undefined;
        act(() => {
            const {getByText, container, getByPlaceholderText} = renderWithReactIntl(<EditAppointment
                appointmentUuid="36fdc60e-7ae5-4708-9fcc-8c98daba0ca9" isRecurring="false" />);
            getByTextInDom = getByText;
            containerInDom = container;
            getByPlaceholderTextInDom = getByPlaceholderText
        });
        await flushPromises();
        const dateSelectedField = containerInDom.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField.textContent).toBe("11");
    })
});

describe('Edit appointment with appointment request enabled', () => {
    const config = {enableAppointmentRequests: true, maxAppointmentProviders: 10};
    const currentProvider = {uuid: "f9badd80-ab76-11e2-9e96-0800200c9a66"};

    const selectPatient = async (container, getByText) => {
        const targetPatient = '9DEC74AB 9DEC74B7 (IQ1110)';
        const inputBox = container.querySelector('.react-select__input input');
        fireEvent.blur(inputBox);
        fireEvent.change(inputBox, {target: {value: "abc"}});
        await waitForElement(
            () => (container.querySelector('.react-select__menu'))
        );
        const option = getByText(targetPatient);
        fireEvent.click(option);
        let singleValue;
        await waitForElement(
            () =>
                (singleValue = container.querySelector(
                    '.react-select__single-value'
                ))
        );
    };

    const selectService = async (container, getByText) => {
        const targetService = 'Ortho Requested';
        const inputBoxService = container.querySelectorAll('.react-select__input input')[1];
        fireEvent.change(inputBoxService, {target: {value: "Ort"}});
        await waitForElement(() => (container.querySelector('.react-select__menu')));
        const optionService = getByText(targetService);
        fireEvent.click(optionService);
        let singleValueService;
        await waitForElement(
            () =>
                (singleValueService = container.querySelector(
                    '.react-select__single-value'
                ))
        );
    };

    const getAppointmentTime = () => {
        const today = moment();
        const todayInMilliseconds = today.toDate().getTime();
        const addTwoHoursFromNow = moment().add(2, 'hours');
        const addTwoHoursFromNowInMilliseconds = addTwoHoursFromNow.toDate().getTime();
        return {
            startDateTime: todayInMilliseconds,
            endDateTime: addTwoHoursFromNowInMilliseconds,
        };
    };

    const selectProvider = async (container, getByText, searchValue, providerName) => {
        const inputBox = container.querySelectorAll('.react-select__input input')[3];
        fireEvent.change(inputBox, {target: {value: searchValue}});
        await waitForElement(() => (container.querySelector('.react-select__menu')));
        const optionOne = getByText(providerName);
        fireEvent.click(optionOne);

    };

    let getConflictsSpy;
    let saveAppointmentSpy;
    let appointmentTime;

    beforeEach(() => {
        getConflictsSpy = jest.spyOn(appointmentsApi, 'conflictsFor')
            .mockImplementation((param) => Promise.resolve({status: 204}));
        saveAppointmentSpy = jest.spyOn(appointmentsApi, "saveOrUpdateAppointment")
            .mockImplementation((param) => Promise.resolve({
                status: 200,
                data: {startDateTime: appointmentTime.startDateTime}
            }));
        appointmentTime = getAppointmentTime();
    });

    afterEach(() => {
        getConflictsSpy.mockRestore();
        saveAppointmentSpy.mockRestore();
    });
    it('should update the appointment status and provider responses for edits when appointment date/time is changed', async () => {
        let getByTextInDom = undefined;
        let containerInDom = undefined;
        let getByTestIdInDom = undefined;
        act(() => {
            const {container, getByText, queryByText, getByTestId} = renderWithReactIntl(
                <AppContext.Provider value={{setViewDate: jest.fn()}}>
                    renderWithReactIntl(<EditAppointment appConfig={config} appointmentUuid={'123tr5-7ae5-4708-9fcc-8c98daba0ca9'}
                                                         isRecurring="false" currentProvider={currentProvider} />);
                </AppContext.Provider>

            );
            getByTextInDom = getByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
        });

        await flushPromises();
        clickOnFirstDayOfNextMonth(containerInDom);
        fireEvent.click(getByTextInDom('Update'));
        await waitForElement(() => (containerInDom.querySelector('.popup-overlay')));
        fireEvent.click(await getByTestIdInDom("update-confirm-button"));
        await waitForElement(() => (containerInDom.querySelector('.popup-overlay')));

        expect(getConflictsSpy).toHaveBeenCalled();
        expect(saveAppointmentSpy).toHaveBeenCalled();

        const appointmentRequestData = saveAppointmentSpy.mock.calls[0][0];
        expect(appointmentRequestData.status).toEqual("Requested");
        expect(appointmentRequestData.providers.length).toEqual(2);
        expect(appointmentRequestData.providers[0].response).toEqual("AWAITING");
        expect(appointmentRequestData.providers[1].response).toEqual("AWAITING");
    });

    it('should not update the appointment status and provider responses for edits if time is not changed', async () => {
        let getByTextInDom = undefined;
        let containerInDom = undefined;
        let getByTestIdInDom = undefined;
        act(() => {
            const {container, getByText, queryByText, getByTestId} = renderWithReactIntl(
                <AppContext.Provider value={{setViewDate: jest.fn()}}>
                    renderWithReactIntl(<EditAppointment appConfig={config} appointmentUuid={'123tr5-7ae5-4708-9fcc-8c98daba0ca9'}
                                                         isRecurring="false" currentProvider={currentProvider} />);
                </AppContext.Provider>

            );
            getByTextInDom = getByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
        });

        await flushPromises();
        fireEvent.click(getByTextInDom('Update'));
        await waitForElement(() => (containerInDom.querySelector('.popup-overlay')));
        fireEvent.click(await getByTestIdInDom("update-confirm-button"));
        await waitForElement(() => (containerInDom.querySelector('.popup-overlay')));

        expect(getConflictsSpy).toHaveBeenCalled();
        expect(saveAppointmentSpy).toHaveBeenCalled();

        const appointmentRequestData = saveAppointmentSpy.mock.calls[0][0];
        expect(appointmentRequestData.status).toEqual("Scheduled");
        expect(appointmentRequestData.providers.length).toEqual(2);
        expect(appointmentRequestData.providers[0].response).toEqual("ACCEPTED");
        expect(appointmentRequestData.providers[1].response).toEqual("ACCEPTED");
    });

    it('should update the provider responses for newly added providers even if time is not changed', async () => {
        let getByTextInDom = undefined;
        let containerInDom = undefined;
        let getByTestIdInDom = undefined;
        act(() => {
            const {container, getByText, queryByText, getByTestId} = renderWithReactIntl(
                <AppContext.Provider value={{setViewDate: jest.fn()}}>
                    renderWithReactIntl(<EditAppointment appConfig={config} appointmentUuid={'123tr5-7y65-4708-9fcc-8c98daba0ca9'}
                                                         isRecurring="false" currentProvider={currentProvider} />);
                </AppContext.Provider>

            );
            getByTextInDom = getByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
        });
        await flushPromises();

        selectProvider(containerInDom, getByTextInDom, "Three", "Provider Three");

        fireEvent.click(getByTextInDom('Update'));
        await waitForElement(() => (containerInDom.querySelector('.popup-overlay')));
        fireEvent.click(await getByTestIdInDom("update-confirm-button"));
        await waitForElement(() => (containerInDom.querySelector('.popup-overlay')));

        expect(getConflictsSpy).toHaveBeenCalled();
        expect(saveAppointmentSpy).toHaveBeenCalled();

        const appointmentRequestData = saveAppointmentSpy.mock.calls[0][0];
        expect(appointmentRequestData.status).toEqual("Scheduled");
        expect(appointmentRequestData.providers.length).toEqual(3);
        expect(appointmentRequestData.providers[0].name).toEqual("Provider One");
        expect(appointmentRequestData.providers[0].response).toEqual("ACCEPTED");
        expect(appointmentRequestData.providers[1].name).toEqual("Provider Two");
        expect(appointmentRequestData.providers[1].response).toEqual("AWAITING");
        expect(appointmentRequestData.providers[2].name).toEqual("Provider Three");
        expect(appointmentRequestData.providers[2].response).toEqual("AWAITING");
    });

    it('should update the status as scheduled when current provider is added to appointment', async () => {
        let getByTextInDom = undefined;
        let containerInDom = undefined;
        let getByTestIdInDom = undefined;
        act(() => {
            const {container, getByText, queryByText, getByTestId} = renderWithReactIntl(
                <AppContext.Provider value={{setViewDate: jest.fn()}}>
                    renderWithReactIntl(<EditAppointment appConfig={config}
                                                         appointmentUuid={'45hj76-7y65-4708-9fcc-8c98daba0ca9'}
                                                         isRecurring="false" currentProvider={currentProvider} currentProvider={currentProvider}/>);
                </AppContext.Provider>
            );
            getByTextInDom = getByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
        });
        await flushPromises();

        selectProvider(containerInDom, getByTextInDom, "One", "Provider One");

        fireEvent.click(getByTextInDom('Update'));
        await waitForElement(() => (containerInDom.querySelector('.popup-overlay')));
        fireEvent.click(await getByTestIdInDom("update-confirm-button"));
        await waitForElement(() => (containerInDom.querySelector('.popup-overlay')));

        expect(getConflictsSpy).toHaveBeenCalled();
        expect(saveAppointmentSpy).toHaveBeenCalled();

        const appointmentRequestData = saveAppointmentSpy.mock.calls[0][0];
        expect(appointmentRequestData.status).toEqual("Scheduled");
        expect(appointmentRequestData.providers.length).toEqual(2);
        expect(appointmentRequestData.providers[0].name).toEqual("Provider Two");
        expect(appointmentRequestData.providers[0].response).toEqual("AWAITING");
        expect(appointmentRequestData.providers[1].name).toEqual("Provider One");
        expect(appointmentRequestData.providers[1].response).toEqual("ACCEPTED");
    })
});
