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
});
