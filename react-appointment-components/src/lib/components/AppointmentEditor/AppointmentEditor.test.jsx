import React from "react";
import AppointmentEditor from './AppointmentEditor.jsx';
import {renderWithReactIntl} from '../../utils/TestUtil';
import {fireEvent, waitForElement} from "@testing-library/react";
import * as save from './AppointmentEditorService.js';
import moment from "moment";

jest.mock('../../api/patientApi');
jest.mock('../../api/serviceApi');
jest.mock('../../utils/CookieUtil');
const patientApi = require('../../api/patientApi');
const serviceApi = require('../../api/serviceApi');
let getPatientByLocationSpy;
let getAllServicesSpy;

describe('Appointment Editor', () => {

    beforeEach(() => {
        getPatientByLocationSpy = jest.spyOn(patientApi, 'getPatientsByLocation');
        getAllServicesSpy = jest.spyOn(serviceApi, 'getAllServices');
    });
    afterEach(() => {
        getPatientByLocationSpy.mockRestore();
        getAllServicesSpy.mockRestore();
    });

    it('should render an editor', () => {
        const {container} = renderWithReactIntl(<AppointmentEditor/>);
        expect(container.hasChildNodes()).toBeTruthy();
    });

    it('should have an appointment-editor div', () => {
        const {getByTestId} = renderWithReactIntl(<AppointmentEditor/>);
        expect(getByTestId('appointment-editor')).not.toBeNull();
    });

    it('should display the patient search', () => {
        const {container, getByTestId} = renderWithReactIntl(<AppointmentEditor/>);
        expect(container.querySelector('.searchFieldsContainer')).not.toBeNull();
        expect(getByTestId('asyncSelect')).not.toBeNull();
    });

    it('should display the all components search except speciality', function () {
        const {container, getAllByTestId} = renderWithReactIntl(<AppointmentEditor/>);
        expect(container.querySelector('.searchFieldsContainer')).not.toBeNull();

        expect(container.querySelector('.searchFieldsContainerLeft')).not.toBeNull();
        expect(container.querySelector('.searchFieldsContainerLeft').children.length).toBe(4);
        expect(container.querySelector('.searchFieldsContainerRight')).not.toBeNull();
        expect(container.querySelector('.searchFieldsContainerRight').children.length).toBe(1);
        expect(getAllByTestId('select').length).toBe(4);
    });

    it('should display the all components search', function () {
        const config = {
            "enableSpecialities": "true"
        };
        const {container, getAllByTestId} = renderWithReactIntl(<AppointmentEditor appConfig={config}/>);
        expect(container.querySelector('.searchFieldsContainer')).not.toBeNull();
        expect(container.querySelector('.searchFieldsContainerLeft')).not.toBeNull();
        expect(container.querySelector('.searchFieldsContainerLeft').children.length).toBe(5);
        expect(container.querySelector('.searchFieldsContainerRight')).not.toBeNull();
        expect(container.querySelector('.searchFieldsContainerRight').children.length).toBe(1);
        expect(getAllByTestId('select').length).toBe(5);
    });

    it('should render AppointmentEditorFooter', function () {
        const {getByTestId, container} = renderWithReactIntl(<AppointmentEditor/>);
        expect(container.querySelector('.footer')).not.toBeNull();
        expect(container.querySelector('.footerElements')).not.toBeNull();
        expect(container.querySelector('.footer').children.length).toBe(1);
        expect(container.querySelector('.footerElements').children.length).toBe(2);
    });

    it('should render AppointmentDatePicker', function () {
        const {getByTestId} = renderWithReactIntl(<AppointmentEditor/>);
        expect(getByTestId('datePicker')).not.toBeNull();
    });

    it('should display error message when patient search value is changed and no new value selected', async () => {
        const placeholder = 'placeholder';
        const onChnageSpy = jest.fn();
        const targetPatient = '9DEC74AB 9DEC74B7 (IQ1110)';
        const {container, getByText, querySelector} = renderWithReactIntl(
            <AppointmentEditor />);
        const inputBox = container.querySelector('.react-select__input input');
        fireEvent.change(inputBox, { target: { value: "abc" } });
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
        fireEvent.change(inputBox, { target: { value: "def" } });
        getByText('Please select patient');
    });

    it('should display error messages when checkAndSave is clicked and required fields are not selected', () => {
        const {getByText, getAllByText} = renderWithReactIntl(<AppointmentEditor/>);
        const button = getByText('Check and Save');
        const saveAppointmentSpy = jest.spyOn(save, 'saveAppointment');
        fireEvent.click(button);
        getByText('Please select patient');
        getByText('Please select service');
        getByText('Please select date');
        const timeError = getAllByText('Please select time');
        expect(timeError.length).toBe(2);
        expect(saveAppointmentSpy).not.toHaveBeenCalled();
    });

    it('should display time error message when time is not selected and remaining fields are selected ', async () => {
        const {container, getByText, queryByText, getAllByTitle, getAllByText} = renderWithReactIntl(<AppointmentEditor/>);

        //select patient
        const targetPatient = '9DEC74AB 9DEC74B7 (IQ1110)';
        const inputBox = container.querySelector('.react-select__input input');
        fireEvent.change(inputBox, { target: { value: "abc" } });
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

        //select service
        const targetService = 'Physiotherapy OPD';
        const inputBoxService = container.querySelectorAll('.react-select__input input')[1];
        fireEvent.change(inputBoxService, { target: { value: "Phy" } });
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

        //select date
        const getCellByTitle = (getAllByTitle, title) => {
            const querySelector = getAllByTitle(title);
            return querySelector[0].children[0];
        };
        const tomorrow = moment().add(1, "days").format("MMMM D, YYYY");
        const dateCell = getCellByTitle(getAllByTitle, tomorrow);
        fireEvent.click(dateCell);

        fireEvent.click(getByText('Check and Save'));

        expect(queryByText('Please select patient')).toBeNull();
        expect(queryByText('Please select service')).toBeNull();
        expect(queryByText('Please select date')).toBeNull();
        expect(getAllByText('Please select time').length).toBe(2);
    });

    it('should display all the child components', () => {
        const config = {
            "enableSpecialities": "true"
        };
        const {getByText, getByTestId, getAllByTestId} = renderWithReactIntl(<AppointmentEditor appConfig={config}/>);
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
        getByTestId('notes');
        expect(getAllByTestId('error-message').length).toBe(7);
    });

    //TODO need to add test to check the status of response on click of checkAndSave
    //TODO Not able to do because onChange of time picket is not getting called. Need to fix that
});

