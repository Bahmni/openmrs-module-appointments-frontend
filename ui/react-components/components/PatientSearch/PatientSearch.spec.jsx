import '@testing-library/jest-dom/extend-expect';
import {fireEvent, waitForElement} from "@testing-library/react";
import PatientSearch from "./PatientSearch.jsx";
import React from "react";
import selectEvent from "react-select-event";
import {renderWithReactIntl} from '../../utils/TestUtil';

jest.mock('../../api/patientApi');
jest.mock('../../utils/CookieUtil');
const patientApi = require('../../api/patientApi');
let getPatientByLocationSpy;

describe('Patient Search', () => {
    beforeEach(() => {
        getPatientByLocationSpy = jest.spyOn(patientApi, 'getPatientsByLocation');
    });
    afterEach(() => {
        getPatientByLocationSpy.mockRestore();
    });

    it('should allow user to search and select a patient', async () => {
        const targetPatient = '9DEC74AB 9DEC74B7 (IQ1110)';
        const {container, getByText} = renderWithReactIntl(<PatientSearch onChange={jest.fn()}/>);
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
        expect(getPatientByLocationSpy).toHaveBeenCalled();
        expect(singleValue).toHaveTextContent(targetPatient);
    });

    it('should not search for patients when less than 3 characters are entered', async () => {
        const targetPatient = '9DEC74AB 9DEC74B7 (IQ1110)';
        const {container, getByText} = renderWithReactIntl(<PatientSearch onChange={jest.fn()}/>);
        const inputBox = container.querySelector('.react-select__input input');
        fireEvent.change(inputBox, { target: { value: "ab" } });
        await waitForElement(
            () => (container.querySelector('.react-select__menu'))
        );
        expect(getPatientByLocationSpy).not.toHaveBeenCalled();
    });

    it('should display placeholder as "Patient ID"', async () => {
        const targetPatient = '9DEC74AB 9DEC74B7 (IQ1110)';
        const {container, getByText} = renderWithReactIntl(<PatientSearch onChange={jest.fn()}/>);
        getByText('Patient ID');
    });

    it('should call onChnage when option is selected', async () => {
        const targetPatient = '9DEC74AB 9DEC74B7 (IQ1110)';
        const onChangeSpy = jest.fn();
        const {container, getByText} = renderWithReactIntl(<PatientSearch onChange={onChangeSpy}/>);
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
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });
});

