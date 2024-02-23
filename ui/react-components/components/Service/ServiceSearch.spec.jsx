import '@testing-library/jest-dom/extend-expect';
import {fireEvent, waitForElement} from "@testing-library/react";
import ServiceSearch from "./ServiceSearch.jsx";
import React from "react";
import {renderWithReactIntl} from '../../utils/TestUtil';

jest.mock('../../api/serviceApi');
jest.mock('../../utils/CookieUtil');
const serviceApi = require('../../api/serviceApi');
let getAllServicesSpy;

describe('Service Search', () => {
    beforeEach(() => {
        getAllServicesSpy = jest.spyOn(serviceApi, 'getAllServices');
    });
    afterEach(() => {
        getAllServicesSpy.mockRestore();
    });

    it('should allow user to search and select a service', async () => {
        const targetService = 'Physiotherapy OPD';
        const {container, getByText} = renderWithReactIntl(<ServiceSearch onChange={jest.fn()}/>);
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.change(inputBox, { target: { value: "Phy" } });
        await waitForElement(() => (container.querySelector('.bx--list-box__menu')));
        const option = getByText(targetService);
        fireEvent.click(option);

        expect(getAllServicesSpy).toHaveBeenCalled();
    });


    it('should display placeholder as "Service"', async () => {
        const {getByText} = renderWithReactIntl(<ServiceSearch onChange={jest.fn()}/>);
        getByText('Service');
    });

    it('should call onChange when option is selected', async () => {
        const targetService = 'Physiotherapy OPD';
        const onChangeSpy = jest.fn();
        const {container, getByText} = renderWithReactIntl(<ServiceSearch onChange={onChangeSpy}/>);
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.change(inputBox, { target: { value: "Phy" } });
        await waitForElement(
            () => (container.querySelector('.bx--list-box__menu'))
        );
        const option = getByText(targetService);
        fireEvent.click(option);
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });
});

