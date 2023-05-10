import '@testing-library/jest-dom/extend-expect';
import {fireEvent, waitForElement} from "@testing-library/react";
import ServiceTypeSearch from "./ServiceTypeSearch.jsx";
import React from "react";
import {renderWithReactIntl} from '../../utils/TestUtil';

jest.mock('../../api/serviceApi');
jest.mock('../../utils/CookieUtil');
const serviceApi = require('../../api/serviceApi');
let getServiceSpy;

describe('Service Type Search', () => {
    beforeEach(() => {
        getServiceSpy = jest.spyOn(serviceApi, 'getService');
    });
    afterEach(() => {
        getServiceSpy.mockRestore();
    });

    it('should be in disabled mode', function () {
        const uuid = "";
        const {container} = renderWithReactIntl(<ServiceTypeSearch onChange={jest.fn()} serviceUuid={uuid}/>);
        const disabledComponent = container.querySelector('.bx--list-box--disabled');
        expect(getServiceSpy).not.toHaveBeenCalled();
        expect(disabledComponent).not.toBeNull();
    });

    it('should allow user to search and select a service type', async () => {
        const targetServiceType = 'Maxillo-facial dressing [15 min]';
        const uuid = "74d43c99-fee1-4097-904a-e2292711b27f";
        const {container, getByText} = renderWithReactIntl(<ServiceTypeSearch onChange={jest.fn()}
                                                                              serviceUuid={uuid}/>);
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.change(inputBox, {target: {value: "Max"}});
        await waitForElement(() => (container.querySelector('.bx--list-box__menu')));
        const option = getByText(targetServiceType);
        fireEvent.click(option);
        expect(getServiceSpy).toHaveBeenCalled();
    });


    it('should display placeholder as "Service App Type"', async () => {
        const {getByText} = renderWithReactIntl(<ServiceTypeSearch onChange={jest.fn()} serviceUuid={""}/>);
        getByText('Service App Type');
    });

    it('should call onChange when option is selected', async () => {
        const targetServiceType = 'Maxillo-facial dressing [15 min]';
        const uuid = "74d43c99-fee1-4097-904a-e2292711b27f";
        const onChangeSpy = jest.fn();
        const {container, getByText} = renderWithReactIntl(<ServiceTypeSearch onChange={onChangeSpy}
                                                                              serviceUuid={uuid}/>);
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.change(inputBox, {target: {value: "Max"}});
        await waitForElement(
            () => (container.querySelector('.bx--list-box__menu'))
        );
        const option = getByText(targetServiceType);
        fireEvent.click(option);
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });
});

