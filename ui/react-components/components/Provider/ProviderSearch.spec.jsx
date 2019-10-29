import '@testing-library/jest-dom/extend-expect';
import {fireEvent, waitForElement} from "@testing-library/react";
import ProviderSearch from "./ProviderSearch.jsx";
import React from "react";
import {renderWithReactIntl} from '../../utils/TestUtil';

jest.mock('../../api/providerApi');
jest.mock('../../utils/CookieUtil');
const providerApi = require('../../api/providerApi');
let getAllProviders;

describe('Provider Search', () => {
    beforeEach(() => {
        getAllProviders = jest.spyOn(providerApi, 'getAllProviders');
    });
    afterEach(() => {
        getAllProviders.mockRestore();
    });

    it('should allow user to search and select a provider', async () => {
        const selectedProvider = 'Provider One';
        const {container, getByText, getAllByText } = renderWithReactIntl(
            <ProviderSearch onChange={jest.fn()} maxAppointmentProvidersAllowed = {1}/>);
        const inputBox = container.querySelector('.react-select__input input');
        fireEvent.change(inputBox, {target: {value: "One"}});
        await waitForElement(() => (container.querySelector('.react-select__menu')));
        const option = getByText(selectedProvider);
        fireEvent.click(option);
        expect(getAllProviders).toHaveBeenCalled();
        const tag = getAllByText(selectedProvider);
        expect(tag.length).toBe(1);
        expect(tag).not.toBeNull();
    });


    it('should maintain unique provider names even same provider is selected multiple times', async () => {
        const providerOne = 'Provider One';
        const providerTwo = 'Provider Two';
        const {container, getByText, getAllByText } = renderWithReactIntl(
            <ProviderSearch onChange={jest.fn()} maxAppointmentProvidersAllowed = {2}/>);
        const inputBox = container.querySelector('.react-select__input input');

        fireEvent.change(inputBox, {target: {value: "One"}});
        await waitForElement(() => (container.querySelector('.react-select__menu')));
        let option = getByText(providerOne);
        fireEvent.click(option);

        fireEvent.change(inputBox, {target: {value: "Two"}});
        await waitForElement(() => (container.querySelector('.react-select__menu')));
        option = getByText(providerTwo);
        fireEvent.click(option);

        fireEvent.change(inputBox, {target: {value: "One"}});
        await waitForElement(() => (container.querySelector('.react-select__menu')));
        option = container.querySelector('.react-select__option');
        fireEvent.click(option);

        expect(getAllProviders).toHaveBeenCalled();
        const tagOne = getAllByText(providerOne);
        const tagTwo = getAllByText(providerTwo);
        expect(tagOne.length).toBe(1);
        expect(tagOne).not.toBeNull();
        expect(tagTwo.length).toBe(1);
        expect(tagTwo).not.toBeNull();
    });

    it('should call onChange when option is selected', async () => {
        const selectedProvider = 'Provider One';
        const onChangeSpy = jest.fn();
        const {container, getByText, getAllByText } = renderWithReactIntl(
            <ProviderSearch onChange={onChangeSpy} maxAppointmentProvidersAllowed = {1}/>);
        const inputBox = container.querySelector('.react-select__input input');
        fireEvent.change(inputBox, {target: {value: "One"}});
        await waitForElement(() => (container.querySelector('.react-select__menu')));
        const option = getByText(selectedProvider);
        fireEvent.click(option);
        expect(getAllProviders).toHaveBeenCalled();
        const tag = getAllByText(selectedProvider);
        expect(tag.length).toBe(1);
        expect(tag).not.toBeNull();
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should display only one provider when maxAppointmentProvidersAllowed is 1 and 2 providers are selected',
        async () => {
        const providerOne = 'Provider One';
        const providerTwo = 'Provider Two';
        const {container, getByText, getAllByText, queryByText } = renderWithReactIntl(
            <ProviderSearch onChange={jest.fn()} maxAppointmentProvidersAllowed = {1}/>);
        const inputBox = container.querySelector('.react-select__input input');

        fireEvent.change(inputBox, {target: {value: "One"}});
        await waitForElement(() => (container.querySelector('.react-select__menu')));
        let option = getByText(providerOne);
        fireEvent.click(option);

        fireEvent.change(inputBox, {target: {value: "Two"}});
        await waitForElement(() => (container.querySelector('.react-select__menu')));
        option = getByText(providerTwo);
        fireEvent.click(option);

        expect(getAllProviders).toHaveBeenCalled();
        getAllByText(providerOne);
        const tagTwo = queryByText(providerTwo);
        expect(tagTwo).toBeNull();
    });
});

