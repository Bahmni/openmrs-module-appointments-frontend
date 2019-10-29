import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {fireEvent} from '@testing-library/react';
import {renderWithReactIntl} from '../../utils/TestUtil';
import EndDateRadioGroup from "./EndDateRadioGroup.jsx";

describe('EndDateRadioGroup', () => {
    it('should render EndDateRadioGroup component', () => {
        const {container, getByText} = renderWithReactIntl(<EndDateRadioGroup onChange={jest.fn()}
                                                                              onOccurrencesChange={jest.fn()}/>);
        expect(getByText('After')).not.toBeNull();
        expect(getByText('Occurrences')).not.toBeNull();
        expect(getByText('On')).not.toBeNull();
        expect(container.querySelector('.radioButton')).not.toBeNull();
        expect(container.querySelector('.grayOut')).toBeNull();
    });
    it('should call onChange on click of `After` radio button', () => {
        const {queryAllByDisplayValue} = renderWithReactIntl(<EndDateRadioGroup
            onChange={jest.fn()}
            onOccurrencesChange={jest.fn()}/>);
        const radio = queryAllByDisplayValue(/After/);
        expect(radio[0].checked).toBe(false);
        fireEvent.change(radio[0], {target: {checked: true}});
        expect(radio[0].checked).toBe(true);
    });

    it('should call onChange on click of `On` radio button', () => {
        const {queryAllByDisplayValue} = renderWithReactIntl(<EndDateRadioGroup
            onChange={jest.fn()}
            onOccurrencesChange={jest.fn()}/>);
        const radio = queryAllByDisplayValue(/On/);
        expect(radio[0].checked).toBe(false);
        fireEvent.change(radio[0], {target: {checked: true}});
        expect(radio[0].checked).toBe(true);
    });

    it('should disable `After` label and InputNumber if `On` radio button has selected ', () => {
        const {queryAllByDisplayValue, getByTestId} = renderWithReactIntl(<EndDateRadioGroup
            endDateType="On"
            onChange={jest.fn()}
            onOccurrencesChange={jest.fn()}/>);
        const radioOn = queryAllByDisplayValue(/On/);
        const radioAfter = queryAllByDisplayValue(/After/);
        expect(radioOn[0].checked).toBe(true);
        expect(radioAfter[0].checked).toBe(false);

        const querySelector = getByTestId("occurrences");
        fireEvent.change(querySelector, {target: {disabled: true}});
        expect(querySelector.disabled).toBeTruthy();
    });

    it('`On` label should be grayed out when `After` radio button selected', () => {
        const {container, queryAllByDisplayValue} = renderWithReactIntl(<EndDateRadioGroup
            endDateType="After"
            onChange={jest.fn()}
            onOccurrencesChange={jest.fn()}/>);
        const radioAfter = queryAllByDisplayValue(/After/);
        const radioOn = queryAllByDisplayValue(/On/);
        expect(radioAfter[0].checked).toBe(true);
        expect(radioOn[0].checked).toBe(false);
        expect(container.querySelector('.grayOut')).not.toBeNull();
    })
});
