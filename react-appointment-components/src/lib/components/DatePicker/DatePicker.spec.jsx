import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent } from '@testing-library/react';
import AppointmentDatePicker from './DatePicker.jsx';
import moment from 'moment';



describe('DatePicker', () => {

    const getCellByTitle = (getAllByTitle, title) => {
        const querySelector = getAllByTitle(title);
        return querySelector[0].children[0];
    };

    it('should render Calendar component ',() => {
        const {container} = render(<AppointmentDatePicker/>);
        expect(container.querySelector('.appointmentDatePicker')).not.toBeNull();
    });

    it('should display place holder for calendar component', () => {
        const {getByPlaceholderText} = render(<AppointmentDatePicker/>);
        getByPlaceholderText('mm/dd/yyyy');
    });

    it('should call onChange when future date is selected', async () => {
        const onChangeSpy = jest.fn();
        const { getAllByTitle } = render(<AppointmentDatePicker onChange={onChangeSpy} />);
        const tomorrow = moment().add(1, "days").format("MMMM D, YYYY");
        const dateCell = getCellByTitle(getAllByTitle, tomorrow);

        fireEvent.click(dateCell);

        expect(onChangeSpy.mock.calls.length).toBe(1);

        const selectedDate = onChangeSpy.mock.calls[0][0];

        expect(selectedDate.format("MMMM D, YYYY")).toBe(tomorrow);
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('past dates need to be disabled', async () => {
        const yesterday = moment().subtract(1, "days").format("MMMM D, YYYY");
        const {getAllByTitle } = render(<AppointmentDatePicker />);
        const dateCell = getCellByTitle(getAllByTitle, yesterday);
        expect(dateCell.getAttribute('aria-disabled')).toBeTruthy();
    });

    it('today needs to be enabled', async () => {
        const today = moment().format("MMMM D, YYYY");
        const {getAllByTitle } = render(<AppointmentDatePicker />);
        const dateCell = getCellByTitle(getAllByTitle, today);
        expect(dateCell.getAttribute('aria-disabled')).toBe("false");
        expect(dateCell.getAttribute('aria-selected')).toBe("true");
    });

    it('tomorrow needs to be enabled', async () => {
        const tomorrow = moment().add(1, "days").format("MMMM D, YYYY");
        const {getAllByTitle } = render(<AppointmentDatePicker />);
        const dateCell = getCellByTitle(getAllByTitle, tomorrow);
        expect(dateCell.getAttribute('aria-disabled')).toBe("false");
        expect(dateCell.getAttribute('aria-selected')).toBe("false");
    });
});
