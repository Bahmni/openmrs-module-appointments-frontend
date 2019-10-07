import '@testing-library/jest-dom/extend-expect';
import {fireEvent, waitForElement} from "@testing-library/react";
import PatientSearch from "./PatientSearch.jsx";
import React from "react";
import selectEvent from "react-select-event";
import {renderWithReactIntl} from '../../utils/TestUtil';

jest.mock('../../api/patientApi');
jest.mock('../../utils/CookieUtil');

describe('Patient Search', () => {
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
        expect(singleValue).toHaveTextContent(targetPatient);
    });
});

