import {renderWithReactIntl} from "../../utils/TestUtil";
import React from "react";
import SuccessModal from "./SuccessModal.jsx";
import {AppContext} from "../AppContext/AppContext";
import {fireEvent} from "@testing-library/react";

describe('Success Confirmation', () => {
    it('should render success modal closeIcon, text, close and add new appointment navigators', () => {
        const {container, getByText} = renderWithReactIntl(<SuccessModal patientDetails="patientDetails"/>);
        expect(container.querySelectorAll('.saveModal').length).toBe(1);
        expect(container.querySelectorAll('.saveModalCloseIcon').length).toBe(1);
        getByText('Save successful');
        getByText('Please check Appointment calendar for the updated schedule');
        getByText('Close');
        getByText('Add New Appointment');
        expect(container.querySelector('.saveModalBody span').textContent).toBe('The new appointment for the patient patientDetails has been saved.');
        expect(container.querySelectorAll('.button').length).toBe(1);
    });

    it('should call onBack function provided from context on click of close button', () => {
        const onBackSpy = jest.fn();
        const {getByText} = renderWithReactIntl(
            <AppContext.Provider value={{onBack: onBackSpy}}>
                <SuccessModal patientDetails="patientDetails"/>
            </AppContext.Provider>
        );
        fireEvent.click(getByText('Close'));
        expect(onBackSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onBack function provided from context on click of close icon', () => {
        const onBackSpy = jest.fn();
        const {container, getByText} = renderWithReactIntl(
            <AppContext.Provider value={{onBack: onBackSpy}}>
                <SuccessModal patientDetails="patientDetails"/>
            </AppContext.Provider>);
        const closeIcon = container.querySelector('.fa-times');
        fireEvent.click(closeIcon);
        expect(onBackSpy).toHaveBeenCalledTimes(1);
    });

    it('should call reload of window.location on click of add new appointment', () => {
        const spy = jest.fn();
        const {getByText} = renderWithReactIntl(<SuccessModal patientDetails="patientDetails"
                                                              resetAppointmentModal={spy}/>);
        fireEvent.click(getByText('Add New Appointment'));
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
