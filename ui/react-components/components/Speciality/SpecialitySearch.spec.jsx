import '@testing-library/jest-dom/extend-expect';
import {fireEvent, waitForElement} from "@testing-library/react";
import React from "react";
import {renderWithReactIntl} from '../../utils/TestUtil';
import SpecialitySearch from "./SpecialitySearch";

jest.mock('../../api/specialityApi');
jest.mock('../../utils/CookieUtil');
const specialityApi = require('../../api/specialityApi');
let getAllSpecialitiesSpy;

describe('Speciality Search', () => {
    beforeEach(() => {
        getAllSpecialitiesSpy = jest.spyOn(specialityApi, 'getAllSpecialities');
    });
    afterEach(() => {
        getAllSpecialitiesSpy.mockRestore();
    });

    it('should display placeholder as "Speciality"', async () => {
        const {getByText} = renderWithReactIntl(<SpecialitySearch onChange={jest.fn()}/>);
        getByText('Speciality');
    });

    it('should load options when SpecialitySearch component is rendered', () => {
        const {getByText} = renderWithReactIntl(<SpecialitySearch onChange={jest.fn()}/>);
        expect(getAllSpecialitiesSpy).toHaveBeenCalled();
    });

    it('should allow user to search and select a Speciality', async () => {
        const targetSpeciality = 'Neurology';
        const {container, getByText} = renderWithReactIntl(<SpecialitySearch onChange={jest.fn()}/>);
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.change(inputBox, {target: {value: "Ne"}});
        await waitForElement(() => (container.querySelector('.bx--list-box__menu')));
        const option = getByText(targetSpeciality);
        fireEvent.click(option);
        expect(getAllSpecialitiesSpy).toHaveBeenCalled();
    });

    it('should call onChange when option is selected', async () => {
        const targetLocation = 'Cardiology';
        const onChangeSpy = jest.fn();
        const {container, getByText} = renderWithReactIntl(<SpecialitySearch onChange={onChangeSpy}/>);
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.change(inputBox, {target: {value: "Card"}});
        await waitForElement(
            () => (container.querySelector('.bx--list-box__menu'))
        );
        const option = getByText(targetLocation);
        fireEvent.click(option);
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });
});

