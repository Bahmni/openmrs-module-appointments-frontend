import {render, fireEvent, waitForElement} from "@testing-library/react";
import React from "react";
import Dropdown from "./Dropdown.jsx";
import selectEvent from "react-select-event";
import {toHaveTextContent} from '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

const loadOptions = (inputValue, callback) => {
    // eslint-disable-next-line angular/timeout-service
    setTimeout(() => {
        callback(filterColors(inputValue));
    }, 1000);
};

const filterColors = (inputValue) => {
    return colourOptions.filter(i =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
};

export const colourOptions = [
    { value: 'ocean', label: 'Ocean'},
    { value: 'blue', label: 'Blue' },
    { value: 'orange', label: 'Orange' },
    { value: 'yellow', label: 'Yellow'},
    { value: 'green', label: 'Green' },
    { value: 'forest', label: 'Forest' },
    { value: 'slate', label: 'Slate'},
    { value: 'silver', label: 'Silver'}
];

const typeToSearch = 'Type to search';

describe('Dropdown', () => {
    it('should show the passed placeholder by default', () => {
        const placeholder = 'placeholder';
        const {getByText} = render(<Dropdown placeholder={placeholder}/>);
        getByText(placeholder);
    });

    it('should show Type to search when dropdown is empty and selected', async () => {
        const placeholder = 'placeholder';
        const {container, getByText} = render(<Dropdown placeholder={placeholder}/>);
        const querySelector = container.querySelector('.react-select__control');
        fireEvent.keyDown(querySelector, { key: 'ArrowDown', keyCode: 40 });
        const noOption = await waitForElement(() => getByText(typeToSearch));
        expect(noOption).not.toBeNull();
    });

    it('should display options on search of available value', async () => {
        const placeholder = 'placeholder';
        const {container, getByText, queryByText} = render(<Dropdown placeholder={placeholder} loadOptions={loadOptions}/>);
        const inputBox = container.querySelector('.react-select__input input');
        fireEvent.change(inputBox, { target: { value: "oc" } });
        await waitForElement(() => getByText('Ocean'));
        await selectEvent.select(inputBox, "Ocean");
        expect(container.querySelector('.react-select__single-value')).toHaveTextContent('Ocean');
        const noOption = await queryByText(typeToSearch);
        expect(noOption).toBeNull();
    });

    it('should not display options on search of unavailable value', async () => {
        const placeholder = 'placeholder';
        const {container, getByText} = render(<Dropdown placeholder={placeholder} loadOptions={loadOptions}/>);
        const inputBox = container.querySelector('.react-select__input input');
        fireEvent.change(inputBox, { target: { value: "ab" } });
        const noOption = await waitForElement(() => getByText(typeToSearch));
        expect(noOption).not.toBeNull();
    });

    it('should display a search icon', () => {
        const placeholder = 'placeholder';
        const {container} = render(<Dropdown placeholder={placeholder}/>);
        const searchIcon = container.querySelector('.fa-search');
        expect(searchIcon).toBeInTheDocument();
    });
});
