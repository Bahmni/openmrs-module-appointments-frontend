import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {fireEvent} from '@testing-library/react';
import {renderWithReactIntl} from '../../utils/TestUtil';
import RecurrenceTypeRadioGroup from "./RecurrenceTypeRadioGroup.jsx";


describe('EndDateRadioGroup', () => {
    it('should render StartDateRadioGroup component', () => {
        const {container, getByText, debug} = renderWithReactIntl(<RecurrenceTypeRadioGroup
            onChange={jest.fn()}
            onPeriodChange={jest.fn()}/>);
        expect(getByText('Day')).not.toBeNull();
        expect(getByText('Week')).not.toBeNull();
        expect(container.querySelector('.recurrenceTypeContainer')).not.toBeNull();
        expect(container.querySelector('.recurrenceTypeDiv')).not.toBeNull();
        expect(container.querySelector('.recurrenceTypeDiv')).not.toBeNull();
        expect(container.querySelector('.grayOut')).toBeNull();
    });

    it('should call onChange on click of `Day` radio button', () => {
        const {queryAllByDisplayValue } = renderWithReactIntl(<RecurrenceTypeRadioGroup
            onChange={jest.fn()}
            onPeriodChange={jest.fn()}/>);
        const radio = queryAllByDisplayValue(/DAY/);
        expect(radio[0].checked).toBe(false);
        fireEvent.change(radio[0], {target: {checked: true}});
        expect(radio[0].checked).toBe(true);
    });

    it('should call onChange on click of `Week` radio button', () => {
        const {getByTestId} = renderWithReactIntl(<RecurrenceTypeRadioGroup
            onChange={jest.fn()}
            onPeriodChange={jest.fn()}/>);
        const radio = getByTestId('week-type');
        expect(radio.checked).toBe(false);
        fireEvent.change(radio, {target: {checked: true}});
        expect(radio.checked).toBe(true);
    });

    it('should clear day radio selection on check of week and vice-versa', () => {
        const {getByTestId} = renderWithReactIntl(<RecurrenceTypeRadioGroup
            onChange={jest.fn()}
            onPeriodChange={jest.fn()}/>);
        const radioDay = getByTestId('day-type');
        fireEvent.change(radioDay, {target: {checked: true}});
        const radioWeek = getByTestId('week-type');
        fireEvent.change(radioWeek, {target: {checked: true}});
        expect(radioDay.checked).toBe(false);
        expect(radioWeek.checked).toBe(true);
    });
});
