import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {fireEvent} from '@testing-library/react';
import {renderWithReactIntl} from '../../utils/TestUtil';
import StartDateRadioGroup from "./StartDateRadioGroup.jsx";


describe('EndDateRadioGroup', () => {
    it('should render StartDateRadioGroup component', () => {
        const {container, getByText} = renderWithReactIntl(<StartDateRadioGroup onChange={jest.fn()}/>);
        expect(getByText('Today')).not.toBeNull();
        expect(getByText('From')).not.toBeNull();
        expect(container.querySelector('.radioButton')).not.toBeNull();
        expect(container.querySelector('.grayOut')).toBeNull();
    });

    it('should call onChange on click of `Today` radio button', () => {
        const {container, queryAllByDisplayValue } = renderWithReactIntl(<StartDateRadioGroup onChange={jest.fn()}/>);
        const radio = queryAllByDisplayValue(/TODAY/);
        expect(radio[0].checked).toBe(false);
        fireEvent.change(radio[0], {target: {checked: true}});
        expect(radio[0].checked).toBe(true);
    });

    it('should call onChange on click of `From` radio button', () => {
        const {container, queryAllByDisplayValue} = renderWithReactIntl(<StartDateRadioGroup onChange={jest.fn()}/>);
        const radio = queryAllByDisplayValue(/FROM/);
        expect(radio[0].checked).toBe(false);
        fireEvent.change(radio[0], {target: {checked: true}});
        expect(radio[0].checked).toBe(true);
    });

    it('`From` label should be grayed out when `Today` radio button selected', () => {
        const {container, queryAllByDisplayValue} = renderWithReactIntl(<StartDateRadioGroup startDateType="TODAY" onChange={jest.fn()}/>);
        const radioToday = queryAllByDisplayValue(/TODAY/);
        const radioFrom = queryAllByDisplayValue(/FROM/);
        expect(radioToday[0].checked).toBe(true);
        expect(radioFrom[0].checked).toBe(false);
        expect(container.querySelector('.grayOut')).not.toBeNull();
    })
});
