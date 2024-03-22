import '@testing-library/jest-dom/extend-expect';
import {fireEvent, waitForElement} from "@testing-library/react";
import PatientSearch from "./PatientSearch.jsx";
import React from "react";
import {renderWithReactIntl} from '../../utils/TestUtil';

jest.mock('../../api/patientApi');
jest.mock('../../utils/CookieUtil');
const patientApi = require('../../api/patientApi');
let getPatientByLocationSpy;

jest.mock('lodash.debounce', () => ({
    __esModule: true,
    default: jest.fn(c => c),
}));

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
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.change(inputBox, { target: { value: "abc" } });
        await waitForElement(
            () => (container.querySelector('.bx--list-box__menu-item'))
        );
        const option = getByText(targetPatient);
        fireEvent.click(option);
        expect(getPatientByLocationSpy).toHaveBeenCalled();
    });

    it('should not search for patients when less than 3 characters are entered', async () => {
        const {container, getByText} = renderWithReactIntl(<PatientSearch onChange={jest.fn()}/>);
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.change(inputBox, { target: { value: "ab" } });
        await waitForElement(
            () => (getByText('Type to search'))
        );
        expect(getPatientByLocationSpy).not.toHaveBeenCalled();
    });

    it('should search for patients only when the user enters the given number of characters', async () => {
        const {container} = renderWithReactIntl(<PatientSearch onChange={jest.fn()}
                                                               minCharLengthToTriggerPatientSearch={4}/>);
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.change(inputBox, { target: { value: "abc" } });
        await waitForElement(
            () => (container.querySelector('.bx--list-box__menu-item__option'))
        );
        expect(getPatientByLocationSpy).not.toHaveBeenCalled();
        fireEvent.change(inputBox, { target: { value: "abcd" } });

        setTimeout(() => {
            expect(getPatientByLocationSpy).toHaveBeenCalled();
        }, 3000);

    });

    it('should not make a second search for patients call when the user enters new characters within 3 seconds', async () => {
        const {container} = renderWithReactIntl(<PatientSearch onChange={jest.fn()}
                                                               minCharLengthToTriggerPatientSearch={4}/>);
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.change(inputBox, { target: { value: "abcd" } });
        await waitForElement(
            () => (container.querySelector('.bx--list-box__menu-item__option'))
        );
        expect(getPatientByLocationSpy).toHaveBeenCalled();
        fireEvent.change(inputBox, { target: { value: "abcde" } });

        setTimeout(() => {
            expect(getPatientByLocationSpy).not.toHaveBeenCalled();
        }, 2000);

    });

    it('should  make a second search for patients call when the user enters new characters after 3 seconds', async () => {
        const {container} = renderWithReactIntl(<PatientSearch onChange={jest.fn()}/>);
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.change(inputBox, { target: { value: "abcd" } });
        await waitForElement(
            () => (container.querySelector('.bx--list-box__menu-item__option'))
        );
        expect(getPatientByLocationSpy).toHaveBeenCalled();
        fireEvent.change(inputBox, { target: { value: "abcde" } });

        setTimeout(() => {
            expect(getPatientByLocationSpy).toHaveBeenCalled();
        }, 3000);

    });

    it('should display placeholder as "Patient ID"', async () => {
        const {getByPlaceholderText} = renderWithReactIntl(<PatientSearch onChange={jest.fn()}/>);
        expect(getByPlaceholderText('Patient ID')).toBeTruthy();

    });

    it('should call onChnage when option is selected', async () => {
        const targetPatient = '9DEC74AB 9DEC74B7 (IQ1110)';
        const onChangeSpy = jest.fn();
        const {container, getByText} = renderWithReactIntl(<PatientSearch onChange={onChangeSpy}/>);
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.change(inputBox, { target: { value: "abc" } });
        await waitForElement(
            () => (container.querySelector('.bx--list-box__menu-item'))
        );
        const option = getByText(targetPatient);
        fireEvent.click(option);
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });
});
