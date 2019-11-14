import React from 'react';
import {renderWithReactIntl} from '../../utils/TestUtil';
import AppointmentPlan from "./AppointmentPlan.jsx";
import {fireEvent} from '@testing-library/react';


describe('Recurring plan', () => {
    it('should render the Recurring plan component', () => {
        const {container, getByText} = renderWithReactIntl(<AppointmentPlan onChange={jest.fn()}/>);
        expect(getByText('Plan')).not.toBeNull();
        expect(getByText('Recurring Appointment')).not.toBeNull();
        expect(container.querySelector('.checkbox')).not.toBeNull();
        expect(container.querySelector('.checkboxContainer')).not.toBeNull();
    });

    it('should call onChange on click of recurring appointment checkbox', () => {
        const onChangeSpy = jest.fn();
        const {container} = renderWithReactIntl(<AppointmentPlan onChange={onChangeSpy}/>);
        const checkBoxService = container.querySelector('.rc-checkbox-input');
        fireEvent.click(checkBoxService);
        expect(onChangeSpy).toHaveBeenCalled();
    });

    it('should disable the checkbox when isEdit is true', () => {
        const {container} = renderWithReactIntl(<AppointmentPlan isEdit={true}/>);
        expect(container.querySelector('.rc-checkbox-disabled')).not.toBeNull()
    });

    it('should display walk-in appointment', () => {
        const {getByText} = renderWithReactIntl(<AppointmentPlan/>);
        getByText('Walk-in Appointment');
    });

    it('should not select the walk in appointment', () => {
        const {container} = renderWithReactIntl(<AppointmentPlan/>);
        expect(container.querySelectorAll('.rc-checkbox-input')[1].checked).toBeFalsy();
    });

    it('should call onChange on click of walk in checkbox', () => {
        const onChangeSpy = jest.fn();
        const {container} = renderWithReactIntl(<AppointmentPlan onChange={onChangeSpy}/>);
        const checkBoxService = container.querySelectorAll('.rc-checkbox-input')[1];
        fireEvent.click(checkBoxService);
        expect(onChangeSpy).toHaveBeenCalled();
    });
});
