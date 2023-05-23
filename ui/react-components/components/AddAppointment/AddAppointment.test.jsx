import React from "react";
import AddAppointment from "./AddAppointment.jsx";
import {renderWithReactIntl} from "../../utils/TestUtil";
import {fireEvent, getAllByTestId, waitForElement} from "@testing-library/react";
import * as addAppointmentService from "./AddAppointmentService.js";
import moment from "moment";
import {AppContext} from "../AppContext/AppContext";
import {getPatient} from "../../api/patientApi";
import {getByTestId} from "@testing-library/dom";

jest.mock('../../api/patientApi');
jest.mock('../../api/serviceApi');
jest.mock('../../api/specialityApi');
jest.mock('../../api/providerApi');
jest.mock('../../utils/CookieUtil');
jest.mock('../../utils/LocalStorageUtil.js', () => ({
    getLocale: jest.fn().mockReturnValue("en-US"),
}));

jest.mock('../../api/appointmentsApi');

const patientApi = require('../../api/patientApi');
const serviceApi = require('../../api/serviceApi');
const specialityApi = require('../../api/specialityApi');
const providerApi = require('../../api/providerApi');
const appointmentsApi = require('../../api/appointmentsApi');

let getPatientByLocationSpy;
let getAllServicesSpy;
let getAllSpecialitiesSpy;
let getAllProvidersSpy;
let getPatientSpy;

const clickOnFirstDayOfNextMonth = (container) => {
    const nextMonth = moment().add(1, 'month'); // Get the moment object for the next month
    const firstDayNextMonth = nextMonth.startOf('month');
    const datePickerInput = container.querySelector('.bx--date-picker__input');
    fireEvent.change(datePickerInput, {target: {value: firstDayNextMonth.format("MM/DD/YYYY") }});
    fireEvent.blur(datePickerInput)
    return firstDayNextMonth;
};

describe('Add Appointment', () => {
    beforeEach(() => {
        getPatientByLocationSpy = jest.spyOn(patientApi, 'getPatientsByLocation');
        getPatientSpy = jest.spyOn(patientApi, 'getPatient');
        getAllServicesSpy = jest.spyOn(serviceApi, 'getAllServices');
        getAllSpecialitiesSpy = jest.spyOn(specialityApi, 'getAllSpecialities');
        getAllProvidersSpy = jest.spyOn(providerApi, 'getAllProviders');
        jest.useFakeTimers();
    });
    afterEach(() => {
        getPatientByLocationSpy.mockRestore();
        getAllServicesSpy.mockRestore();
        getAllSpecialitiesSpy.mockRestore();
        getAllProvidersSpy.mockRestore();
        getPatientSpy.mockRestore();
    });

    it('should render an editor', () => {
        const {container} = renderWithReactIntl(<AddAppointment/>);
        expect(container.hasChildNodes()).toBeTruthy();
    });

    it('should have an appointment-editor div', () => {
        const {getByTestId} = renderWithReactIntl(<AddAppointment/>);
        expect(getByTestId('appointment-editor')).not.toBeNull();
    });

    it('should display the patient search', () => {
        const {container, getByTestId} = renderWithReactIntl(<AddAppointment/>);
        expect(getByTestId('search-patient')).not.toBeNull();
    });

    it('should display the all components search except speciality', function () {
        const config = {
            "enableServiceTypes": true
        };
        const {container, getByTestId} = renderWithReactIntl(<AddAppointment appConfig={config}/>);
        expect(container.querySelector('.bx--search-input')).not.toBeNull();
        expect(container.querySelector('.bx--list-box')).not.toBeNull();
        expect(container.querySelectorAll('.bx--list-box').length).toEqual(4);
        expect(getByTestId('search-patient')).not.toBeNull();
        expect(getByTestId('service-search')).not.toBeNull();
        expect(() => getByTestId('speciality-search')).toThrow();
        expect(getByTestId('provider-search')).not.toBeNull();
        expect(getByTestId('location-search')).not.toBeNull();
    });

    it('should display the all components search', function () {
        const config = {
            "enableSpecialities": true,
            "enableServiceTypes": true
        };
        const {container, getByTestId} = renderWithReactIntl(<AddAppointment appConfig={config}/>);
        expect(container.querySelector('.bx--search-input')).not.toBeNull();
        expect(container.querySelector('.bx--list-box')).not.toBeNull();
        expect(container.querySelectorAll('.bx--list-box').length).toEqual(5);
        expect(getByTestId('patient-search')).not.toBeNull();
        expect(getByTestId('service-search')).not.toBeNull();
        expect(getByTestId('speciality-search')).not.toBeNull();
        expect(getByTestId('provider-search')).not.toBeNull();
        expect(getByTestId('location-search')).not.toBeNull();
    });

    it('should render AppointmentEditorFooter', function () {
        const {getByTestId, container} = renderWithReactIntl(<AddAppointment/>);
        expect(container.querySelector('.footer')).not.toBeNull();
        expect(getByTestId( "Appointment-editer-footer")).not.toBeNull();
    });

    it('should render AppointmentDatePicker', function () {
        const {getByTestId} = renderWithReactIntl(<AddAppointment/>);
        expect(getByTestId('datePicker')).not.toBeNull();
    });

    it('should display error messages when checkAndSave is clicked and required fields are not selected', () => {
        const {getByText, getAllByText, getByTestId} = renderWithReactIntl(<AddAppointment/>);
        const button = getByTestId('check-and-save');
        const saveAppointmentSpy = jest.spyOn(addAppointmentService, 'saveAppointment');
        fireEvent.click(button);
        getByText('Please select patient');
        getByText('Please select service');
        getByText('Please select date');
        const timeError = getAllByText('Please select time');
        expect(timeError.length).toBe(2);
        expect(saveAppointmentSpy).not.toHaveBeenCalled();
    });

    it('should display time error message when time is not selected and remaining fields are selected ', async () => {
        const config = {
            "prioritiesForDateless": ["Routine", "Priority"]
        }
        const {container, getByTestId, getByText, queryByText, getByPlaceholderText, getAllByText} = renderWithReactIntl(
            <AddAppointment appConfig={config}/>);

        //select patient
        const targetPatient = '9DEC74AB 9DEC74B7 (IQ1110)';
        const inputBox = container.querySelector('.bx--search-input');
        fireEvent.blur(inputBox);
        fireEvent.change(inputBox, { target: { value: "abc" } });
        await waitForElement(
            () => (container.querySelector('.bx--tile--clickable'))
        );
        fireEvent.click(container.querySelector('.bx--tile--clickable'))


        //select service
        const targetService = 'Physiotherapy OPD';
        const inputBoxService = container.querySelector('.bx--text-input');
        fireEvent.change(inputBoxService, { target: { value: "Phy" } });
        await waitForElement(() => (container.querySelector('.bx--list-box__menu')));
        const option = getByText(targetService);
        fireEvent.click(option);

        //select date
        const selectedDate = clickOnFirstDayOfNextMonth(container)

        const dateInputField = container.querySelector('.bx--date-picker__input');
        expect(dateInputField.value).toBe(selectedDate.format('MM/DD/YYYY'));

        fireEvent.click(getByText('Check and Save'));

        expect(queryByText('Please select patient')).toBeNull();
        expect(queryByText('Please select service')).toBeNull();
        expect(queryByText('Please select date')).toBeNull();
        expect(getAllByText('Please select time').length).toBe(2);
    });

    it('should display all the child components', () => {
        const config = {
            "enableSpecialities": true,
            "enableServiceTypes": true
        };
        const {getByText, getByTestId, getAllByTestId} = renderWithReactIntl(<AddAppointment appConfig={config}/>);
        const checkAndSaveButton = getByText('Check and Save');
        fireEvent.click(checkAndSaveButton);
        getByTestId('patient-search');
        getByTestId('service-search');
        getByTestId('service-type-search');
        getByTestId('speciality-search');
        getByTestId('location-search');
        getByTestId('date-selector');
        getByTestId('start-time-selector');
        getByTestId('end-time-selector');
        getByTestId('appointment-notes');
        expect(getAllByTestId('error-message').length).toBe(8);
    });

    //TODO: Fix these tests after recurring appointments plan is enabled with new UI
    //
    // it('should display recurring plan', () => {
    //     const {container, getByText} = renderWithReactIntl(<AddAppointment/>);
    //     expect(getByText('Plan')).not.toBeNull();
    //     expect(container.querySelector('.planLabel')).not.toBeNull();
    // });
    //
    // it('should render all recurring components on click of recurring appointments checkbox', () => {
    //     const {container, getByTestId, getByText, getAllByText} = renderWithReactIntl(<AddAppointment/>);
    //     const checkBoxService = container.querySelector('.rc-checkbox-input');
    //     fireEvent.click(checkBoxService);
    //     expect(container.querySelector('.checkbox')).toBeChecked;
    //     getByTestId('start-date-group');
    //     getByTestId('end-date-group');
    //     getByTestId('recurrence-type-group');
    //     expect(getByText('Starts')).not.toBeNull();
    //     expect(getByText('Today')).not.toBeNull();
    //     expect(getAllByText('From')).not.toBeNull();
    //     expect(getAllByText('From').length).toBe(2);
    //     expect(getByText('To')).not.toBeNull();
    //     expect(getByText('Ends')).not.toBeNull();
    //     expect(getByText('After')).not.toBeNull();
    //     expect(getByText('On')).not.toBeNull();
    //     expect(getByText('Occurrences')).not.toBeNull();
    //     expect(getByText('Repeats Every')).not.toBeNull();
    //     expect(getByText('Day')).not.toBeNull();
    //     expect(getByText('Week')).not.toBeNull();
    //     expect(getByText('Choose a time slot')).not.toBeNull();
    // });

    // it('should display error messages when checkAndSave is clicked and required recurring fields are not selected', () => {
    //     const {getByText, queryByText, getAllByTestId, getAllByText, container} = renderWithReactIntl(
    //         <AddAppointment/>);
    //     const saveAppointmentSpy = jest.spyOn(addAppointmentService, 'saveRecurring');
    //     const checkBox = container.querySelector('.rc-checkbox-input');
    //     fireEvent.click(checkBox);
    //     const checkAndSaveButton = getByText('Check and Save');
    //     fireEvent.click(checkAndSaveButton);
    //     expect(queryByText('Please select patient')).not.toBeNull();
    //     expect(queryByText('Please select service')).not.toBeNull();
    //     expect(queryByText('Please select valid recurrence period')).not.toBeNull();
    //     expect(getAllByText('Please select time').length).toBe(2);
    //     expect(getAllByText('Please select date').length).toBe(1);
    //     expect(getAllByText('Please select recurrence end type').length).toBe(1);
    //     expect(getAllByTestId('error-message').length).toBe(12);
    //     expect(saveAppointmentSpy).not.toHaveBeenCalled();
    //
    // });

    // it('should not display error message for start date & end date when today and after radio buttons are clicked', function () {
    //     const config = {
    //         "recurrence": {
    //             "defaultNumberOfOccurrences": 10
    //         }
    //     };
    //     const {getByText, container, queryAllByText, getByTestId, queryByText} = renderWithReactIntl(<AddAppointment
    //         appConfig={config}/>);
    //     const saveAppointmentSpy = jest.spyOn(addAppointmentService, 'saveRecurring');
    //     const checkBox = container.querySelector('.rc-checkbox-input');
    //     fireEvent.click(checkBox);
    //     const todayButton = getByTestId("today-radio-button");
    //     fireEvent.click(todayButton);
    //     const afterButton = getByTestId("after-radio-button");
    //     fireEvent.click(afterButton);
    //     const checkAndSaveButton = getByText('Check and Save');
    //     fireEvent.click(checkAndSaveButton);
    //     expect(queryAllByText('Please select date').length).toBe(0);
    //     expect(saveAppointmentSpy).not.toHaveBeenCalled();
    // });

    // it('should display all week days on click of recurring checkbox', () => {
    //     const config = {
    //         "startOfWeek": "Tuesday",
    //         "recurrence": {
    //             "defaultNumberOfOccurrences": 10
    //         }
    //     };
    //     const {container, getByTestId} = renderWithReactIntl(<AddAppointment appConfig={config}/>);
    //     const checkBoxService = container.querySelector('.rc-checkbox-input');
    //     fireEvent.click(checkBoxService);
    //     fireEvent.click(getByTestId('week-type'));
    //     const buttonsOrder = [];
    //     container.querySelectorAll('.buttonGroup button').forEach(button => buttonsOrder.push(button.innerHTML));
    //     expect(buttonsOrder).toStrictEqual(['Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo']);
    // });

    // it('should toggle the week day selection on click', () => {
    //     const config = {
    //         "startOfWeek": "Tuesday",
    //         "recurrence": {
    //             "defaultNumberOfOccurrences": 10
    //         }
    //     };
    //     const {container, getAllByText, getByTestId} = renderWithReactIntl(<AddAppointment appConfig={config}/>);
    //     const checkBoxService = container.querySelector('.rc-checkbox-input');
    //     fireEvent.click(checkBoxService);
    //     fireEvent.click(getByTestId('week-type'));
    //     fireEvent.click(getAllByText('Su')[2]);
    //     fireEvent.click(getAllByText('We')[2]);
    //     fireEvent.click(getAllByText('Sa')[2]);
    //     fireEvent.click(getAllByText('Sa')[2]);
    //     expect(container.querySelectorAll('.buttonGroup .selected').length).toBe(2);
    //     expect(container.querySelectorAll('.buttonGroup button:not(.selected)').length).toBe(5);
    // });

    // it('should display week days error message when check and save is clicked without selecting wek days', () => {
    //     const config = {
    //         "startOfWeek": "Tuesday",
    //         "recurrence": {
    //             "defaultNumberOfOccurrences": 10
    //         }
    //     };
    //     const {container, getByText, getByTestId} = renderWithReactIntl(<AddAppointment appConfig={config}/>);
    //     const checkBoxService = container.querySelector('.rc-checkbox-input');
    //     fireEvent.click(checkBoxService);
    //     fireEvent.click(getByTestId('week-type'));
    //     fireEvent.click(getByText('Check and Save'));
    //     getByText('Please select the day(s)');
    // });

    //TODO need to add test to check the status of response on click of checkAndSave
    //TODO need to add test for conflicts api on click of check and save
    //TODO Not able to do because onChange of time picket is not getting called. Need to fix that

    // it('should toggle the selection of checkbox when changing the other', () => {
    //     const {container} = renderWithReactIntl(<AddAppointment/>);
    //     const recurringCheckBox = container.querySelectorAll('.rc-checkbox-input')[0];
    //     fireEvent.click(recurringCheckBox);
    //     const walkInCheckBox = container.querySelectorAll('.rc-checkbox-input')[1];
    //     fireEvent.click(walkInCheckBox);
    //     expect(container.querySelectorAll('.rc-checkbox-input')[0].checked).toBeFalsy();
    //     expect(container.querySelectorAll('.rc-checkbox-input')[1].checked).toBeTruthy();
    // });

    it('should display location based on service', async () => {
        getAllServicesSpy.mockResolvedValue([{"name" : "Physiotherapy OPD", "uuid" : "serviceUuid", "location" : {"name": "Hospital", uuid: "locationUuid"}}]);
        const {container, getByText, getByTestId} = renderWithReactIntl(<AddAppointment/>);

        //select speciality
        const targetService = 'Physiotherapy OPD';
        const inputBoxService = getByTestId('service-search').querySelector('.bx--text-input');
        fireEvent.change(inputBoxService, {target: {value: "Phy"}});
        let serviceDropDownOption;
        await waitForElement(() => (serviceDropDownOption = container.querySelector('.bx--list-box__menu-item__option')));
        fireEvent.click(serviceDropDownOption);
        const inputBoxLocation = getByTestId('location-search').querySelector('.bx--text-input');

        expect(inputBoxService.value).toEqual(targetService);
        expect(inputBoxLocation.value).toEqual("Hospital");
    });

    it('should clear service service type and location when speciality is changed', async () => {
        getAllSpecialitiesSpy.mockResolvedValue([{"name" : "Cardiology", "uuid" : "specialityUuidOne"}, {"name" : "Neurology", "uuid" : "specialityUuidTwo"}]);
        getAllServicesSpy.mockResolvedValue([{"name" : "Physiotherapy OPD", "uuid" : "serviceUuid", "speciality":
                {"name": "Cardiology", "uuid": "specialityUuidOne"}, "location" : {"name": "Hospital", "uuid": "locationUuid"}}]);
        const config = {enableSpecialities: true};
        const {getByText, getByTestId, queryByText} = renderWithReactIntl(<AddAppointment appConfig={config}/>);

        //select speciality
        const targetSpeciality = 'Cardiology';
        const inputBoxSpeciality = getByTestId('speciality-search').querySelector('.bx--text-input');
        fireEvent.change(inputBoxSpeciality, {target: {value: "Card"}});
        await waitForElement(() => (getByTestId('speciality-search').querySelector('.bx--list-box__menu-item__option')));
        const optionSpeciality = getByText(targetSpeciality);
        fireEvent.click(optionSpeciality);

        //select service
        const targetService = 'Physiotherapy OPD';
        const inputBoxService = getByTestId('service-search').querySelector('.bx--text-input');
        fireEvent.change(inputBoxService, {target: {value: "Phy"}});
        await waitForElement(() => (getByTestId('service-search').querySelector('.bx--list-box__menu-item__option')));
        const optionService = getByText(targetService);
        fireEvent.click(optionService);

        // change speciality
        fireEvent.change(inputBoxSpeciality, {target: {value: "Neu"}});
        await waitForElement(() => (getByTestId('speciality-search').querySelector('.bx--list-box__menu-item__option')));
        fireEvent.click(getByText("Neurology"));

        expect(queryByText('Cardiology')).toBeNull();
        expect(queryByText('Physiotherapy OPD')).toBeNull();
        expect(queryByText('Physiotherapy')).toBeNull();
        expect(queryByText('Hospital')).toBeNull();
    });

    it('should populate the start date, start time and end time coming as props for normal appointment', function () {
        const today = moment();
        const todayInMilliseconds = today.toDate().getTime();
        const addTwoHoursFromNow = moment().add(2, 'hours');
        const addTwoHoursFromNowInMilliseconds = addTwoHoursFromNow.toDate().getTime();
        const appointmentParams = {
            startDateTime: todayInMilliseconds,
            endDateTime: addTwoHoursFromNowInMilliseconds,
        };
        const {container, getByPlaceholderText} = renderWithReactIntl(<AddAppointment
            appointmentParams={appointmentParams}/>);
        expect(container.querySelectorAll('.bx--time-picker__input-field')[0].value).toBe(today.format('h:mm').toLowerCase());
        expect(container.querySelectorAll('.bx--time-picker__input-field')[1].value).toBe(addTwoHoursFromNow.format('h:mm').toLowerCase());
        const dateInputField = getByPlaceholderText('mm/dd/yyyy');
        expect(dateInputField.value).toBe(today.format('MM/DD/YYYY'));
    });

    // it('should populate the start date, start time and end time coming as prop for recurring appointment', function () {
    //     const today = moment();
    //     const todayInMilliseconds = today.toDate().getTime();
    //     const addTwoHoursFromNow = moment().add(2, 'hours');
    //     const addTwoHoursFromNowInMilliseconds = addTwoHoursFromNow.toDate().getTime();
    //     const appointmentParams = {
    //         startDateTime: todayInMilliseconds,
    //         endDateTime: addTwoHoursFromNowInMilliseconds,
    //     };
    //     const {container, getAllByPlaceholderText} = renderWithReactIntl(<AddAppointment
    //         appointmentParams={appointmentParams}/>);
    //     const checkBoxService = container.querySelector('.rc-checkbox-input');
    //     fireEvent.click(checkBoxService);
    //     expect(container.querySelectorAll('.rc-time-picker-input')[0].value).toBe(today.format('h:mm A').toLowerCase());
    //     expect(container.querySelectorAll('.rc-time-picker-input')[1].value).toBe(addTwoHoursFromNow.format('h:mm A').toLowerCase());
    //     const dateInputField = getAllByPlaceholderText('mm/dd/yyyy')[0];
    //
    //     expect(dateInputField.value).toBe(today.format('MM/DD/YYYY'));
    // });

    it('should not add second provider when maxAppointmentProvidersAllowed is 1', async () => {
        const config = {maxAppointmentProviders: 1};
        const {container, getByTestId, getByText, queryByText} = renderWithReactIntl(<AddAppointment appConfig={config}/>);

        let selectedProvider = "Provider One";
        const inputBox = getByTestId('provider-search').querySelector('.bx--text-input');
        fireEvent.change(inputBox, {target: {value: "One"}});
        let providerDropDownOption;
        await waitForElement(() => (providerDropDownOption = getByTestId('provider-search').querySelector('.bx--list-box__menu-item__option')));
        expect(getByText(selectedProvider)).toBeTruthy();
        fireEvent.click(providerDropDownOption);

        fireEvent.change(inputBox, {target: {value: "Two"}});
        await waitForElement(() => (providerDropDownOption = getByTestId('provider-search').querySelector('.bx--list-box__menu-item__option')));
        expect(getByText(selectedProvider)).toBeTruthy();
        const optionTwo = getByText(selectedProvider);
        fireEvent.click(providerDropDownOption);

        expect(queryByText("Provider One")).not.toBeNull();
        expect(queryByText("Provider Two")).toBeNull();
    });

    it('should display error message and disappear after 3 seconds when second provider is selected and ' +
        'maxAppointmentProvidersAllowed is 1', async () => {
        const config = {maxAppointmentProviders: 1};
        const {getByTestId, getByText, queryByText} = renderWithReactIntl(<AddAppointment appConfig={config}/>);

        let selectedProvider = "Provider One";
        const inputBox = getByTestId('provider-search').querySelector('.bx--text-input');
        fireEvent.change(inputBox, {target: {value: "One"}});
        let providerDropDownOption;
        await waitForElement(() => (providerDropDownOption = getByTestId('provider-search').querySelector('.bx--list-box__menu-item__option')));
        expect(getByText(selectedProvider)).toBeTruthy();
        fireEvent.click(providerDropDownOption);

        fireEvent.change(inputBox, {target: {value: "Two"}});
        await waitForElement(() => (providerDropDownOption = getByTestId('provider-search').querySelector('.bx--list-box__menu-item__option')));
        selectedProvider = "Provider Two";
        expect(getByText(selectedProvider)).toBeTruthy();
        fireEvent.click(providerDropDownOption);

        expect(queryByText("Provider One")).not.toBeNull();
        getByText("Please select only a maximum of 1 provider(s)");
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 200);
        jest.runAllTimers();
        expect(queryByText("Please select only a maximum of 1 provider(s)")).toBeNull();
    });

    it('should hide service appointment type if enableServiceTypes is undefined', () => {
        const {queryByText} = renderWithReactIntl(<AddAppointment/>);
        expect(queryByText("Service App Type")).toBeNull();
    });

    it('should hide service appointment type if enableServiceTypes is false', () => {
        const {queryByText} = renderWithReactIntl(<AddAppointment/>);
        expect(queryByText("Service App Type")).toBeNull();
    });

    it('should display service appointment type if enableServiceTypes is true', () => {
        const {getByText} = renderWithReactIntl(<AddAppointment appConfig={{enableServiceTypes: true}}/>);
        getByText("Service App Type");
    });

    it('should not add provider if selected twice', async () => {
        const config = {maxAppointmentProviders: 2};
        const {getByTestId, getByText, queryByText, queryAllByText} = renderWithReactIntl(<AddAppointment
            appConfig={config}/>);

        let selectedProvider = "Provider One";
        const inputBox = getByTestId('provider-search').querySelector('.bx--text-input');
        fireEvent.change(inputBox, {target: {value: "One"}});
        let providerDropDownOption;
        await waitForElement(() => (providerDropDownOption = getByTestId('provider-search').querySelector('.bx--list-box__menu-item__option')));
        expect(getByText(selectedProvider)).toBeTruthy();
        fireEvent.click(providerDropDownOption);

        selectedProvider = "Provider Two";
        fireEvent.change(inputBox, {target: {value: "Two"}});
        await waitForElement(() => (providerDropDownOption = getByTestId('provider-search').querySelector('.bx--list-box__menu-item__option')));
        expect(getByText(selectedProvider)).toBeTruthy();
        fireEvent.click(providerDropDownOption);

        fireEvent.change(inputBox, {target: {value: "Two"}});
        await waitForElement(() => (providerDropDownOption = getByTestId('provider-search').querySelector('.bx--list-box__menu-item__option')));
        fireEvent.click(providerDropDownOption);

        expect(queryByText("Provider One")).not.toBeNull();
        expect(queryByText("Provider Two")).not.toBeNull();
        expect(queryAllByText("Provider Two").length).toBe(1);
    });

    it('should change appointment date when a new date is selected', async () => {
        const today = moment();
        const config = {
            "prioritiesForDateless": ["Routine", "Priority"]
        };
        const {container, getByPlaceholderText, queryByText} = renderWithReactIntl(<AddAppointment appConfig={config}/>);
        const selectedDate = clickOnFirstDayOfNextMonth(container);

        const dateInputField = getByPlaceholderText('mm/dd/yyyy');
        expect(dateInputField.value).toBe(selectedDate.format('MM/DD/YYYY'));

    });
    it('should fetch patient details on load if patient is present in url params', () => {
        const {findByText} = renderWithReactIntl(<AddAppointment urlParams={{patient:"6bb24e7e-5c04-4561-9e7a-2d2bbf8074ad"}}/>);
        expect(findByText('Test Patient')).not.toBeNull();
    });
});

describe('Add appointment with appointment request enabled', () => {
    const config = {enableAppointmentRequests: true, maxAppointmentProviders: 10};
    const currentProvider = {uuid: "f9badd80-ab76-11e2-9e96-0800200c9a66"};

    const selectPatient = async (container, getByText) => {
        const targetPatient = '9DEC74AB 9DEC74B7 (IQ1110)';
        const inputBox = container.querySelector('.bx--search-input');
        fireEvent.blur(inputBox);
        fireEvent.change(inputBox, { target: { value: "abc" } });
        let searchedPatient;
        await waitForElement(
            () => (searchedPatient = container.querySelector('.bx--tile--clickable'))
        );
        expect(getByText(targetPatient)).toBeTruthy();
        fireEvent.click(searchedPatient);
    };

    const selectService = async (getByTestId, getByText) => {
        const targetService = 'Ortho Requested';
        const inputBoxService = getByTestId("service-search").querySelector('.bx--text-input');
        fireEvent.change(inputBoxService, {target: {value: "Ort"}});
        await waitForElement(() => (getByTestId("service-search").querySelector('.bx--list-box__menu-item__option')));
        const optionService = getByText(targetService);
        fireEvent.click(optionService);
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

    const selectProvider = async (getByTestId, getByText, searchValue, providerName) => {
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
        appointmentTime = getAppointmentTime();
        getConflictsSpy = jest.spyOn(appointmentsApi, 'conflictsFor')
            .mockImplementation((param) => Promise.resolve({status: 204}));
        saveAppointmentSpy = jest.spyOn(appointmentsApi, "saveOrUpdateAppointment")
            .mockImplementation((param) => Promise.resolve({
                status: 200,
                data: {startDateTime: appointmentTime.startDateTime}
            }));
    });

    afterEach(() => {
        getConflictsSpy.mockRestore();
        saveAppointmentSpy.mockRestore();
    });

    it('should update the appointment status and provider responses if the AppointmentRequest is Enabled', async () => {
        const {container, getByText, getByTestId, queryByText} = renderWithReactIntl(
            <AppContext.Provider value={{setViewDate: jest.fn()}}>
                <AddAppointment appConfig={config} appointmentParams={appointmentTime} currentProvider={currentProvider}/>
            </AppContext.Provider>

        );
        await selectPatient(container, getByText);
        await selectService(getByTestId, getByText);
        await selectProvider(getByTestId, getByText, "Two", "Provider Two");
        await selectProvider(getByTestId, getByText, "Three", "Provider Three");

        const button = getByTestId('check-and-save');
        fireEvent.click(button);
        await waitForElement(() => (container.querySelector('.popup-overlay')));

        expect(getConflictsSpy).toHaveBeenCalled();
        expect(saveAppointmentSpy).toHaveBeenCalled();

        const appointmentRequestData = saveAppointmentSpy.mock.calls[0][0];
        expect(appointmentRequestData.status).toEqual("Requested");
        expect(appointmentRequestData.providers.length).toEqual(2);
        expect(appointmentRequestData.providers[0].response).toEqual("AWAITING");
        expect(appointmentRequestData.providers[1].response).toEqual("AWAITING");
    });

    it('should update the appointment status as Scheduled when current provider is part of appointment', async () => {
        const {container, getByTestId, getByText, queryByText} = renderWithReactIntl(
            <AppContext.Provider value={{setViewDate: jest.fn()}}>
                <AddAppointment appConfig={config} appointmentParams={appointmentTime} currentProvider={currentProvider}/>
            </AppContext.Provider>

        );
        await selectPatient(container, getByText);
        await selectService(getByTestId, getByText);
        await selectProvider(getByTestId, getByText, "One", "Provider One");
        await selectProvider(getByTestId, getByText, "Two", "Provider Two");

        const button = getByTestId('check-and-save');
        fireEvent.click(button);
        await waitForElement(() => (container.querySelector('.popup-overlay')));

        expect(getConflictsSpy).toHaveBeenCalled();
        expect(saveAppointmentSpy).toHaveBeenCalled();

        const appointmentRequestData = saveAppointmentSpy.mock.calls[0][0];
        expect(appointmentRequestData.status).toEqual("Scheduled");
        expect(appointmentRequestData.providers.length).toEqual(2);
        expect(appointmentRequestData.providers[0].name).toEqual("Provider One");
        expect(appointmentRequestData.providers[0].response).toEqual("ACCEPTED");
        expect(appointmentRequestData.providers[1].name).toEqual("Provider Two");
        expect(appointmentRequestData.providers[1].response).toEqual("AWAITING");
    })
});
