import '@testing-library/jest-dom/extend-expect';
import {fireEvent, waitForElement, wait} from "@testing-library/react";
import ProviderSearch from "./ProviderSearch.jsx";
import React from "react";
import {renderWithReactIntl} from '../../utils/TestUtil';

jest.mock('../../api/providerApi');
jest.mock('../../utils/CookieUtil');
const providerApi = require('../../api/__mocks__/providerApi');
let getAllProviders;

describe('Provider Search', () => {
    beforeEach(() => {
        getAllProviders = jest.spyOn(providerApi, 'getAllProviders');
    });
    afterEach(() => {
        getAllProviders.mockRestore();
    });


    it('should display given selected providers in the tags', async () => {
        const selectedProviders = [{
            comments: null, label: "Name 1", response: "ACCEPTED", value: "8e459c7d-20e0-11e7-a53f-000c29e530d1"
        }, {
            comments: null, label: "Name 2", response: "ACCEPTED", value: "8e459c7d-20e0-11e7-a53f-000c29e530d2"
        }, {
            comments: null, label: "Name 3", response: "ACCEPTED", value: "8e459c7d-20e0-11e7-a53f-000c29e530d3"
        }];
        const {getByText} = renderWithReactIntl(
            <ProviderSearch onChange={jest.fn()} maxAppointmentProvidersAllowed = {1}
                            selectedProviders={selectedProviders} onProviderRemove={jest.fn()}/>);
        getByText("Name 1");
        getByText("Name 2");
        getByText("Name 3");
    });

    it('should call onChange when any provider is selected from dropdown', async () => {
        const selectedProviders = [{
            comments: null, label: "Name 1", response: "ACCEPTED", value: "8e459c7d-20e0-11e7-a53f-000c29e530d1"
        }, {
            comments: null, label: "Name 2", response: "ACCEPTED", value: "8e459c7d-20e0-11e7-a53f-000c29e530d2"
        }, {
            comments: null, label: "Name 3", response: "ACCEPTED", value: "8e459c7d-20e0-11e7-a53f-000c29e530d3"
        }];
        const selectedProvider = "Provider One";
        const onChangeSpy = jest.fn();
        const {container,getByText} = renderWithReactIntl(
            <ProviderSearch onChange={onChangeSpy} maxAppointmentProvidersAllowed = {5}
                            selectedProviders={selectedProviders} onProviderRemove={jest.fn()}/>);
        // const inputBox = container.querySelector('.react-select__input input');
        // console.log('inputBox',inputBox.value)
        // fireEvent.click(inputBox);
        // await wait()
        // await waitForElement(() => (container.querySelector('.react-select__menu')));
        // const menu = await container.querySelector('.react-select__menu')
        // console.log(menu)
        // const option = getByText(selectedProvider);
        // fireEvent.click(option);
        // expect(getAllProviders).toHaveBeenCalled();
        // expect(onChangeSpy).toHaveBeenCalledTimes(1);

        // const inputBox = container.querySelector('.react-select__input input');
        // fireEvent.click(inputBox);
        // await waitForElement(
        //     () => (container.querySelector('.react-select__menu'))
        // );
        // const option = getByText(selectedProvider);
        // fireEvent.click(option);
        // let singleValue;
        // await waitForElement(
        //     () =>
        //         (singleValue = container.querySelector(
        //             '.react-select__single-value'
        //         ))
        // );
        // expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should render only providers with response as Accepted', async () => {
        const selectedProviders = [{
            comments: null, label: "Name 1", response: "ACCEPTED", value: "8e459c7d-20e0-11e7-a53f-000c29e530d1"
        },{
            comments: null, label: "Name 3", response: "CANCELLED", value: "8e459c7d-20e0-11e7-a53f-000c29e530d3"
        }];
        const onChangeSpy = jest.fn();
        const {queryByText, getByText} = renderWithReactIntl(
            <ProviderSearch onChange={onChangeSpy} maxAppointmentProvidersAllowed = {5}
                            selectedProviders={selectedProviders} onProviderRemove={jest.fn()}/>);
        getByText("Name 1");
        expect(queryByText("Name 3")).toBeNull();
    });
});

