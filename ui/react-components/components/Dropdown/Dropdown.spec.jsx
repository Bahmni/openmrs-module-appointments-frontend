import {fireEvent, waitForElement} from "@testing-library/react";
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
        const {container, getByText} = renderWithReactIntl(<Dropdown placeholder={placeholder}
                                                                     options={colourOptions}/>);
        const inputBox = container.querySelector('.react-select__input input');
        fireEvent.change(inputBox, {target: {value: "ab"}});
        const noOption = await waitForElement(() => getByText(noOptionText));
        expect(noOption).not.toBeNull();
    });

    it('should display a search icon', () => {
        const placeholder = 'placeholder';
        const {container} = renderWithReactIntl(<Dropdown placeholder={placeholder}/>);
        const searchIcon = container.querySelector('.fa-search');
        expect(searchIcon).toBeInTheDocument();
    });

    it('should call onChange when option is selected', async () => {
        const placeholder = 'placeholder';
        const onChangeSpy = jest.fn();
        const {container, getByText, queryByText} = renderWithReactIntl(
            <Dropdown placeholder={placeholder}
                      options={colourOptions}
                      onChange={onChangeSpy}/>);
        const inputBox = container.querySelector('.react-select__input input');
        fireEvent.change(inputBox, {target: {value: "oc"}});
        await waitForElement(() => getByText('Ocean'));
        await selectEvent.select(inputBox, "Ocean");
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should translate no option message if translation message is provided', async () => {
        const placeholder = 'placeholder';
        const noOptionMessage = 'No Options';
        const {container, getByText} = renderWithReactIntl(<Dropdown placeholder={placeholder}/>,
            {'DROPDOWN_NO_OPTIONS_MESSAGE': noOptionMessage});
        const querySelector = container.querySelector('.react-select__control');
        fireEvent.keyDown(querySelector, {key: 'ArrowDown', keyCode: 40});
        const noOption = await waitForElement(() => getByText(noOptionMessage));
        expect(noOption).not.toBeNull();
    });
});
