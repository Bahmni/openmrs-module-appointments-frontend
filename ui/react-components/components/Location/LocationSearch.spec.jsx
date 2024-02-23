import '@testing-library/jest-dom/extend-expect';
import {fireEvent, waitForElement} from "@testing-library/react";
import React from "react";
import {renderWithReactIntl} from '../../utils/TestUtil';
import LocationSearch from "./LocationSearch";

jest.mock('../../api/locationApi');
jest.mock('../../utils/CookieUtil');
const locationApi = require('../../api/locationApi');
let getAllByTagSpy;

describe('Service Search', () => {
    beforeEach(() => {
        getAllByTagSpy = jest.spyOn(locationApi, 'getAllByTag');
    });
    afterEach(() => {
        getAllByTagSpy.mockRestore();
    });

    it('should display placeholder as "Location"', async () => {
        const {getByText} = renderWithReactIntl(<LocationSearch onChange={jest.fn()}/>);
        getByText('Location');
    });

    it('should load options when LocationSearch component is rendered', () => {
        const {getByText} = renderWithReactIntl(<LocationSearch onChange={jest.fn()}/>);
        expect(getAllByTagSpy).toHaveBeenCalled();
    });

    it('should allow user to search and select a location', async () => {
        const targetLocation = 'OPD-1';
        const {container, getByText} = renderWithReactIntl(<LocationSearch onChange={jest.fn()}/>);
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.focus(inputBox);
        fireEvent.change(inputBox, {target: {value: "OP"}});
        await waitForElement(() => (container.querySelector('.bx--list-box__menu')));
        const option = getByText(targetLocation);
        fireEvent.click(option);
        expect(getAllByTagSpy).toHaveBeenCalled();
    });

    it('should call onChange when option is selected', async () => {
        const targetLocation = 'Unknown Location';
        const onChangeSpy = jest.fn();
        const {container, getByText} = renderWithReactIntl(<LocationSearch onChange={onChangeSpy}/>);
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.focus(inputBox);
        fireEvent.change(inputBox, {target: {value: "Unk"}});
        await waitForElement(() => (container.querySelector('.bx--list-box__menu')));
        const option = getByText(targetLocation);
        fireEvent.click(option);
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });
});

