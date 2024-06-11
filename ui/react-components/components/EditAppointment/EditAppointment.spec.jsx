import {renderWithReactIntl} from "../../utils/TestUtil";
import EditAppointment from "./EditAppointment";
import React from "react";
import {conflictsFor, getAppointment} from "../../api/appointmentsApi";
import {act, fireEvent, waitForElement} from "@testing-library/react";
import moment from "moment";
import {AppContext} from "../AppContext/AppContext";
import {getByTestId} from "@testing-library/dom";


jest.mock('../../api/appointmentsApi');
jest.mock('../../api/recurringAppointmentsApi');
jest.mock('../../api/serviceApi');
jest.mock('../../api/providerApi');
jest.mock('../../utils/LocalStorageUtil.js', () => ({
    getLocale: jest.fn().mockReturnValue("en-US"),
}));

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
    const nextMonth = moment().add(1, 'month'); // Get the moment object for the next month
    const firstDayNextMonth = nextMonth.startOf('month');
    const datePickerInput = container.querySelector('.bx--date-picker__input');
    fireEvent.change(datePickerInput, {target: {value: firstDayNextMonth.format("MM/DD/YYYY") }});
    fireEvent.blur(datePickerInput)
    return firstDayNextMonth;
};
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

    it('should call getRecurringAppointment when isRecurring is true', () => {
        renderWithReactIntl(<EditAppointment appointmentUuid={'36fdc60e-7ae5-4708-9fcc-8c98daba0ca9'}
                                             isRecurring="true"/>);
        expect(recurringAppointmentsApiSpy).toHaveBeenCalledTimes(1);
    });

    //TODO Warnings while running tests
    it('should render appointment details coming from response', async () => {
        let getByTextInDom = undefined;
        let getByTestIdInDom = undefined;
        let containerInDom = undefined;
        const config = {
            "enableSpecialities": true,
            "enableServiceTypes": true
        };
        act(() => {
            const {getByText, container, getByTestId} = renderWithReactIntl(<EditAppointment
                appointmentUuid={'36fdc60e-7ae5-4708-9fcc-8c98daba0ca9'} isRecurring="false" appConfig={config}/>);
            getByTextInDom = getByText;
            getByTestIdInDom = getByTestId;
            containerInDom = container;
        });
        await flushPromises();
        expect(containerInDom.querySelectorAll(".bx--text-input")[0].value).toEqual("9DEC81BF 9DEC81C6 (IQ1114)");
        expect(containerInDom.querySelectorAll(".bx--text-input")[1].value).toEqual("test speciality");
        expect(containerInDom.querySelectorAll(".bx--text-input")[2].value).toEqual("Physiotherapy OPD");
        expect(containerInDom.querySelectorAll(".bx--text-input")[5].value).toEqual("Operating Theatre");
        expect(containerInDom.querySelectorAll(".bx--time-picker__input-field")[0].value).toEqual("11:00");
        expect(containerInDom.querySelectorAll(".bx--time-picker__input-field")[1].value).toEqual("11:30");
        expect(containerInDom.querySelector(".bx--text-area").value).toEqual("comments");
        getByTextInDom('comments');
        getByTextInDom('Update');
        getByTestIdInDom('cancel');
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
        expect(getByTestIdInDom("search-patient").value).toEqual('9DEC81BF 9DEC81C6 (IQ1114)');

        const inputs = containerInDom.querySelectorAll(".bx--text-input");
        expect(inputs[1].value).toEqual('test speciality');
        expect(inputs[2].value).toEqual('Physiotherapy OPD');
        expect(inputs[5].value).toEqual('Operating Theatre');
        expect(inputs[3].value).toEqual('1 session');
        expect(inputs[6].value).toEqual('11:00');
        expect(inputs[7].value).toEqual('11:30');
        getByTextInDom('Repeats every');
        getByTextInDom('Day(s)');
        expect(getByTestIdInDom("recurring-occurrences").value).toBe('3');
        getByTextInDom('Occurrences');
        expect(containerInDom.querySelectorAll(".bx--time-picker__input-field")[0].value).toBe('11:00');
        expect(containerInDom.querySelectorAll(".bx--time-picker__input-field")[1].value).toBe('11:30');
        getByTextInDom('comments');
        getByTextInDom('Update');
        getByTestIdInDom('cancel');
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
        expect(getByTestIdInDom("search-patient").value).toEqual('9DEC81BF 9DEC81C6 (IQ1114)');

        const inputs = containerInDom.querySelectorAll(".bx--text-input");
        expect(inputs[1].value).toEqual('test speciality');
        expect(inputs[2].value).toEqual('Physiotherapy OPD');
        expect(inputs[5].value).toEqual('Operating Theatre');
        expect(inputs[3].value).toEqual('1 session');
        expect(inputs[6].value).toEqual('11:00');
        expect(inputs[7].value).toEqual('11:30');
        getByTextInDom('Repeats every');
        getByTextInDom('Week(s)');
        expect(getByTestIdInDom('SUNDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('MONDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('TUESDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('WEDNESDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('THURSDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('FRIDAY').hasAttribute('disabled')).toBeTruthy();
        expect(getByTestIdInDom('SATURDAY').hasAttribute('disabled')).toBeTruthy();
        expect(containerInDom.querySelectorAll(".bx--time-picker__input-field")[0].value).toBe('11:00');
        expect(containerInDom.querySelectorAll(".bx--time-picker__input-field")[1].value).toBe('11:30');
        getByTextInDom('comments');
        getByTextInDom('Update');
        getByTestIdInDom('cancel');
    });

    it('should recurring plan component', () => {
        const {getByText} = renderWithReactIntl(<EditAppointment appointmentUuid={'appt-uuid'} isRecurring="true"/>);
        getByText('Recurring Appointment');
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
        const serviceBox = containerInDom.querySelectorAll('.bx--text-input')[1]
        expect(serviceBox.value).toBe('Physiotherapy OPD');
        getAllServicesSpy.mockResolvedValue([{"name" : "Physiotherapy OPD", "uuid" : "2b87edcf-39ac-4dec-94c9-713b932e847c",
            "speciality": {"name": "test speciality", "uuid": "8de35e75-20e0-11e7-a53f-5usc29e530d2"},
            "location" : {"name": "Operating Theatre", "uuid": "8debb630-20e0-11e7-a53f-000c29e530d2"}},
            {"name" : "Dressing", "uuid" : "serviceUuidTwo"}]);

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

        fireEvent.click(getByTextInDom('Update'));

        expect(getByTestIdInDom("update-buttons")).not.toBeNull();
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
        fireEvent.click(containerInDom.querySelector('.bx--number__control-btn.down-icon'));
        expect(containerInDom.querySelector('.updateOptions')).toBeNull();

        fireEvent.click(containerInDom.querySelector('.bx--number__control-btn.up-icon'));
        fireEvent.click(getByTextInDom('Update'));

        expect(getByTestIdInDom('update-buttons')).not.toBeNull();
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
        let datePickerInput;
        act(() => {
            const {getByText, container, getByTestId, getAllByTitle} = renderWithReactIntl(<EditAppointment
                appointmentUuid={"36fdc60e-7ae5-4708-9fcc-8c98daba0ca9"} isRecurring="false" appConfig={config}/>);
            getByTextInDom = getByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
            getAllByTitleInDom = getAllByTitle;
            datePickerInput = container.querySelector('.bx--date-picker__input');
        });
        await flushPromises();

        //clear date
        fireEvent.change(datePickerInput, {target: {value: "" }});

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

        const startTime = containerInDom.querySelectorAll(".bx--time-picker__input-field")[0]
        const endTime = containerInDom.querySelectorAll(".bx--time-picker__input-field")[1]
        expect(startTime.value).toBe('11:00');
        expect(endTime.value).toBe('11:30');

        //clear time
        fireEvent.change(startTime, {target: {value: ""}})
        fireEvent.blur(startTime)
        fireEvent.change(endTime, {target: {value: ""}})
        fireEvent.blur(endTime)

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

        getByTestIdInDom("recurring-occurrences");

        //clear occurrences
        const zeroOccurrences = "0";
        const inputBoxService = getByTestIdInDom("recurring-occurrences");
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
        let getByTestIdInDom = undefined;

        const config = {
            "enableServiceTypes": true,
            "maxAppointmentProviders": 2
        };
        act(() => {
            const {getByTestId} = renderWithReactIntl(<EditAppointment
                appointmentUuid={'36fdc60e-7ae5-4708-9fcc-8c98daba0ca9'} isRecurring="false" appConfig={config}/>);
            getByTestIdInDom = getByTestId;
        });
        await flushPromises();
        let selectedProvider = "Provider Two";
        const inputBox = getByTestIdInDom('provider-search').querySelector('.bx--text-input');
        fireEvent.change(inputBox, {target: {value: "Two"}});
        let providerDropDownOption;
        await waitForElement(() => (providerDropDownOption = getByTestIdInDom('provider-search').querySelector('.bx--list-box__menu-item__option')));
        fireEvent.click(providerDropDownOption);
        expect(inputBox.value).toEqual(selectedProvider);
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
        const dateSelectedField = containerInDom.querySelector('.bx--date-picker__input');
        expect(moment(dateSelectedField.value).date()).toBe(11);
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

    const selectProvider = async (container, getByTestId, getByText, searchValue, providerName) => {
        const inputBox = getByTestId('provider-search').querySelector('.bx--text-input');
        fireEvent.change(inputBox, {target: {value: searchValue}});
        let providerDropDownOption;
        await waitForElement(() => (providerDropDownOption = getByTestId('provider-search').querySelector('.bx--list-box__menu-item__option')));
        expect(getByText(providerName)).toBeTruthy();
        fireEvent.click(providerDropDownOption);

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
                                                         isRecurring="false" currentProvider={currentProvider} setIsAppointmentModalOpen={jest.fn()}/>);
                </AppContext.Provider>

            );
            getByTextInDom = getByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
        });

        await flushPromises();
        clickOnFirstDayOfNextMonth(containerInDom);
        fireEvent.click(getByTextInDom('Update'));
        await waitForElement(() => (containerInDom.querySelector('.bx--modal-container')));
        fireEvent.click(await getByTextInDom("Yes, I confirm"));
        await waitForElement(() => (containerInDom.querySelector('.bx--inline-notification__details')));

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
                                                         isRecurring="false" currentProvider={currentProvider} setIsAppointmentModalOpen={jest.fn()} />);
                </AppContext.Provider>

            );
            getByTextInDom = getByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
        });

        await flushPromises();
        fireEvent.click(getByTextInDom('Update'));
        await waitForElement(() => (containerInDom.querySelector('.bx--modal-container')));
        fireEvent.click(await getByTextInDom("Yes, I confirm"));
        await waitForElement(() => (containerInDom.querySelector('.bx--inline-notification__details')));

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
                                                         isRecurring="false" currentProvider={currentProvider} setIsAppointmentModalOpen={jest.fn()} />);
                </AppContext.Provider>

            );
            getByTextInDom = getByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
        });
        await flushPromises();

        selectProvider(containerInDom, getByTestIdInDom, getByTextInDom, "Three", "Provider Three");

        fireEvent.click(getByTextInDom('Update'));
        await waitForElement(() => (containerInDom.querySelector('.bx--modal-container')));
        fireEvent.click(await getByTextInDom("Yes, I confirm"));
        await waitForElement(() => (containerInDom.querySelector('.bx--inline-notification__details')));

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
                                                         isRecurring="false" currentProvider={currentProvider} currentProvider={currentProvider} setIsAppointmentModalOpen={jest.fn()} />);
                </AppContext.Provider>
            );
            getByTextInDom = getByText;
            containerInDom = container;
            getByTestIdInDom = getByTestId;
        });
        await flushPromises();

        selectProvider(containerInDom, getByTestIdInDom, getByTextInDom, "One", "Provider One");

        fireEvent.click(getByTextInDom('Update'));
        await waitForElement(() => (containerInDom.querySelector('.bx--modal-container')));
        fireEvent.click(await getByTextInDom("Yes, I confirm"));
        await waitForElement(() => (containerInDom.querySelector('.bx--inline-notification__details')));

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
