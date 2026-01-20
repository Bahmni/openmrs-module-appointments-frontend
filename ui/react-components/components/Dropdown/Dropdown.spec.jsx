import {fireEvent, waitForElement } from "@testing-library/react";
import React from "react";
import Dropdown from "./Dropdown.jsx";
import selectEvent from "react-select-event";
import '@testing-library/jest-dom/extend-expect';
import {renderWithReactIntl} from '../../utils/TestUtil';

const colourOptions = [
    {value: 'ocean', label: 'Ocean'},
    {value: 'blue', label: 'Blue'},
    {value: 'orange', label: 'Orange'},
    {value: 'yellow', label: 'Yellow'},
    {value: 'green', label: 'Green'},
    {value: 'forest', label: 'Forest'},
    {value: 'slate', label: 'Slate'},
    {value: 'silver', label: 'Silver'}
];

describe('Dropdown', () => {
    it('should show the passed placeholder by default', () => {
        const placeholder = 'placeholder';
        const {getByText} = renderWithReactIntl(<Dropdown placeholder={placeholder}/>);
        getByText(placeholder);
    });

    it('should show place holder when dropdown is selected', async () => {
        const placeholder = 'placeholder';
        const {getByText} = renderWithReactIntl(<Dropdown placeholder={placeholder}/>);
        const noOption = await waitForElement(() => getByText(placeholder));
        expect(noOption).not.toBeNull();
    });

    it('should not display options on search of unavailable value', async () => {
        const placeholder = 'placeholder';
        const noOptionText = 'No Options';
        const {getByRole, queryByText} = renderWithReactIntl(<Dropdown placeholder={placeholder}
                                                                     options={colourOptions}/>);
        const input = getByRole('combobox');
        fireEvent.change(input, { target: { value: "ab" } });

        const optionList = queryByText('list-box');
        expect(optionList).not.toBeInTheDocument();
    });

    it('should call onChange when option is selected', async () => {
        const placeholder = 'placeholder';
        const onChangeSpy = jest.fn();
        const {container, getByText, queryByText} = renderWithReactIntl(
            <Dropdown placeholder={placeholder}
                      options={colourOptions}
                      onChange={onChangeSpy}/>);

        const input = container.querySelector('.bx--text-input');

        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'oc' } });

        const option = getByText("Ocean");
        fireEvent.click(option);

        expect(onChangeSpy).toHaveBeenCalledWith({value: 'ocean', label: 'Ocean'});
    });


    it('should be disabled when isDisabled is true', () => {
        const {container} = renderWithReactIntl(<Dropdown isDisabled={true}/>);
        expect(container.querySelector('.disable')).not.toBeNull();
    });

    it('should call onInputChange when input value changes', () => {
        const placeholder = 'placeholder';
        const onInputChangeSpy = jest.fn();
        const {container} = renderWithReactIntl(
            <Dropdown placeholder={placeholder}
                      options={colourOptions}
                      onInputChange={onInputChangeSpy}/>);

        const input = container.querySelector('.bx--text-input');
        fireEvent.change(input, { target: { value: 'blu' } });

        expect(onInputChangeSpy).toHaveBeenCalledWith('blu');
    });

    it('should display custom placeHolderMessage when provided', () => {
        const customPlaceholder = 'Select a color';
        const {container} = renderWithReactIntl(
            <Dropdown placeholder="placeholder"
                      options={colourOptions}
                      placeHolderMessage={customPlaceholder}/>);

        const input = container.querySelector('.bx--text-input');
        expect(input.placeholder).toBe(customPlaceholder);
    });

    it('should display default placeHolderMessage when not provided', () => {
        const {container} = renderWithReactIntl(
            <Dropdown placeholder="placeholder"
                      options={colourOptions}/>);

        const input = container.querySelector('.bx--text-input');
        expect(input.placeholder).toBe('Choose an option');
    });

    it('should display selectedValue when provided', () => {
        const selectedValue = {value: 'blue', label: 'Blue'};
        const {container} = renderWithReactIntl(
            <Dropdown placeholder="placeholder"
                      options={colourOptions}
                      selectedValue={selectedValue}/>);

        const input = container.querySelector('.bx--text-input');
        expect(input.value).toBe('Blue');
    });

    it('should auto focus when autoFocus is true and component is not disabled', () => {
        const {container} = renderWithReactIntl(
            <Dropdown placeholder="placeholder"
                      options={colourOptions}
                      autoFocus={true}/>);

        const input = container.querySelector('.bx--text-input');
        expect(document.activeElement).toBe(input);
    });

    it('should not auto focus when isDisabled is true even if autoFocus is true', () => {
        const {container} = renderWithReactIntl(
            <Dropdown placeholder="placeholder"
                      options={colourOptions}
                      autoFocus={true}
                      isDisabled={true}/>);

        const input = container.querySelector('.bx--text-input');
        expect(document.activeElement).not.toBe(input);
    });

    it('should show required indicator when isRequired is true', () => {
        const placeholder = 'Select option';
        const {getByText} = renderWithReactIntl(
            <Dropdown placeholder={placeholder}
                      options={colourOptions}
                      isRequired={true}/>);

        const requiredIndicator = getByText('*');
        expect(requiredIndicator).toBeInTheDocument();
    });

    it('should not filter items when onInputChange is provided', () => {
        const onInputChangeSpy = jest.fn();
        const {container, getByText} = renderWithReactIntl(
            <Dropdown placeholder="placeholder"
                      options={colourOptions}
                      onInputChange={onInputChangeSpy}/>);

        const input = container.querySelector('.bx--text-input');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'xyz' } });

        expect(onInputChangeSpy).toHaveBeenCalledWith('xyz');
    });

    it('should filter items by default when onInputChange is not provided', () => {
        const {container, getByText, queryByText} = renderWithReactIntl(
            <Dropdown placeholder="placeholder"
                      options={colourOptions}/>);

        const input = container.querySelector('.bx--text-input');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'blu' } });

        const blueOption = getByText('Blue');
        expect(blueOption).toBeInTheDocument();
        
        const orangeOption = queryByText('Orange');
        expect(orangeOption).not.toBeInTheDocument();
    });
});
