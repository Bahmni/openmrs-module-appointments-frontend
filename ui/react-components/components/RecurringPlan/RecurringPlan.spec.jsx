import React from 'react';
import {renderWithReactIntl} from '../../utils/TestUtil';
import RecurringPlan from "./RecurringPlan.jsx";
import {fireEvent} from '@testing-library/react';


describe('Recurring plan', () => {
    it('should render the Recurring plan component', () => {
        const {container, getByText} = renderWithReactIntl(<RecurringPlan onChange={jest.fn()}/>);
        expect(getByText('Plan')).not.toBeNull();
        expect(getByText('Recurring Appointment')).not.toBeNull();
        expect(container.querySelector('.checkbox')).not.toBeNull();
        expect(container.querySelector('.checkboxContainer')).not.toBeNull();
    });

    it('should call onChange on click of checkbox', () => {
        const onChangeSpy = jest.fn();
        const {container, getByText} = renderWithReactIntl(<RecurringPlan onChange={onChangeSpy}/>);
        const checkBoxService = container.querySelector('.rc-checkbox-input');
        fireEvent.click(checkBoxService);
        expect(onChangeSpy).toHaveBeenCalled();
        expect(container.querySelector('.checkbox')).toBeChecked;
    });

    it('should disable the checkbox when isRecurring is false', () => {
        const {container} = renderWithReactIntl(<RecurringPlan isRecurring={false}/>);
        expect(container.querySelector('.rc-checkbox-disabled')).not.toBeNull()
    })
});
