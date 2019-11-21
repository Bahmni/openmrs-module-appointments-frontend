import React from 'react';
import {renderWithReactIntl} from '../../utils/TestUtil';
import AppointmentPlan from "./AppointmentPlan.jsx";
import {fireEvent} from '@testing-library/react';


describe('Appointment plan', () => {
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

    it('should check walk in appointment when appointment type is walk in', () => {
        const {container} = renderWithReactIntl(<AppointmentPlan appointmentType="WalkIn"/>);
        expect(container.querySelectorAll('.rc-checkbox-input')[1].checked).toBeTruthy();
    });

    it('should check recurring appointment when appointment type is recurring', () => {
        const {container} = renderWithReactIntl(<AppointmentPlan appointmentType="Recurring"/>);
        expect(container.querySelectorAll('.rc-checkbox-input')[0].checked).toBeTruthy();
    });

    it('should not check walk in or recurring when appointment type is undefined', () => {
        const {container} = renderWithReactIntl(<AppointmentPlan appointmentType={undefined}/>);
        expect(container.querySelectorAll('.rc-checkbox-input')[0].checked).toBeFalsy();
        expect(container.querySelectorAll('.rc-checkbox-input')[1].checked).toBeFalsy();
    });

    it('should disable the walk in appointment when isWalkInDisabled and isRecurringDisabled are true', () => {
        const {container} = renderWithReactIntl(<AppointmentPlan isRecurringDisabled={true} isWalkInDisabled={true}/>);
        expect(container.querySelectorAll('.rc-checkbox-disabled')[0]).not.toBeUndefined();
        expect(container.querySelectorAll('.disabledLabelContainer')[0]).not.toBeUndefined();
        expect(container.querySelectorAll('.rc-checkbox-disabled')[1]).not.toBeUndefined();
        expect(container.querySelectorAll('.disabledLabelContainer')[1]).not.toBeUndefined();
    });
});
