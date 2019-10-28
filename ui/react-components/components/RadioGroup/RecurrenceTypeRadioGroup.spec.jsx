import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent } from '@testing-library/react';
import {renderWithReactIntl} from '../../utils/TestUtil';
import RecurrenceTypeRadioGroup from "./RecurrenceTypeRadioGroup.jsx";


describe('EndDateRadioGroup', () => {
    it('should render StartDateRadioGroup component', () => {
        const {container, getByText, debug} = renderWithReactIntl(<RecurrenceTypeRadioGroup/>);
        debug();
        expect(getByText('Day')).not.toBeNull();
        expect(getByText('Week')).not.toBeNull();
        expect(container.querySelector('.recurrenceTypeContainer')).not.toBeNull();
        expect(container.querySelector('.recurrenceTypeDiv')).not.toBeNull();
        expect(container.querySelector('.recurrenceTypeDiv')).not.toBeNull();
        expect(container.querySelector('.grayOut')).toBeNull();
    });

    it.only('should call onChange on click of `Day` radio button', () => {
        const {container, queryAllByDisplayValue } = renderWithReactIntl(<RecurrenceTypeRadioGroup onChange={jest.fn()}/>);
        const radio = queryAllByDisplayValue(/DAY/);
        expect(radio[0].checked).toBe(false);
        fireEvent.change(radio[0], {target: {checked: true}});
        expect(radio[0].checked).toBe(true);
    });

});
