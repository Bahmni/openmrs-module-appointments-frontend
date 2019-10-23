import {renderWithReactIntl} from "../../utils/TestUtil";
import React from "react";
import SuccessConfirmation from "./SuccessConfirmation.jsx";

describe('Success Confirmation', () => {
    it('should render success modal closeIcon, text, close and add new appointment navigators', () => {
        const {container, getByText} = renderWithReactIntl(<SuccessConfirmation patientDetails="patientDetails"/>);
        expect(container.querySelectorAll('.saveModal').length).toBe(1);
        expect(container.querySelectorAll('.saveModalCloseIcon').length).toBe(1);
        getByText('Save successful');
        getByText('The new appointment for the patient "patientDetails" has been saved.');
        getByText('Please check Appointment calendar for the updated schedule');
        getByText('Close');
        getByText('Add New Appointment');
        expect(container.querySelectorAll('.button').length).toBe(1);
    });
});