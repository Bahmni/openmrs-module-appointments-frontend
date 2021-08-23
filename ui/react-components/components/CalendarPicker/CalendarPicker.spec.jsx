import React, {useEffect, useState} from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent, wait, act} from '@testing-library/react';
import CalendarPicker from "../CalendarPicker/CalendarPicker.jsx";
import moment from "moment";
jest.mock('../../utils/LocalStorageUtil.js', () => ({
    getLocale: jest.fn().mockReturnValue("en-US"),
}));

const clickOnFirstDayOfNextMonth = (container) => {
    const nextMonth = moment().add(1, 'months');
    const nextButton = container.querySelector('.react-datepicker__navigation--next');
    fireEvent.click(nextButton);
    fireEvent.click(container.querySelector('.react-datepicker__day--001'));
    return nextMonth;
};

describe('CalendarPicker', () =>{
    it('should open a date picker on click of calendar icon', () =>{
        const { getByTestId, queryByTestId} = render(<CalendarPicker/>);
        const calendarIcon = getByTestId('calendar-icon');
        expect(queryByTestId('datePicker')).toBeNull();
        fireEvent.click(calendarIcon);
        expect(getByTestId('datePicker')).not.toBeNull();
    })

    it('should close the picker when clicked outside', () =>{
        const Wrapper = () =>{
            return <div>
                <span data-testId="dummy">Some</span>
                <CalendarPicker/>
            </div>
        }

        const {container, getByTestId, queryByTestId} = render(<Wrapper/>);
        const calendarIcon = getByTestId('calendar-icon');
        expect(queryByTestId('datePicker')).toBeNull();
        fireEvent.click(calendarIcon);
        expect(getByTestId('datePicker')).not.toBeNull();
        fireEvent.click(getByTestId("dummy"))
        expect(queryByTestId('datePicker')).toBeNull();
    })

    it('should close the picker when clicked on any button of datepicker', () =>{
        const Wrapper=(props) =>{
            const {value} = props;
            const [dateValue, setDateValue] = useState(value);
            const onChange = (dateVal) => {
                setDateValue(dateVal)};
            useEffect(()=>{
                setDateValue(value);
            },[value]);
            return <CalendarPicker value={dateValue}
                                          onChange={onChange} minDate={moment()}/>
        }

        const {container, getByTestId, queryByTestId} = render(<Wrapper/>);
        const calendarIcon = getByTestId('calendar-icon');
        expect(queryByTestId('datePicker')).toBeNull();
        fireEvent.click(calendarIcon);
        expect(getByTestId('datePicker')).not.toBeNull();
        clickOnFirstDayOfNextMonth(container);
        expect(queryByTestId('datePicker')).toBeNull();
    })

    it('should not show the date picker on click of icon when component is disabled',()=>{
        const { getByTestId, queryByTestId} = render(<CalendarPicker isDisabled={true}/>);
        const calendarIcon = getByTestId('calendar-icon');
        expect(queryByTestId('datePicker')).toBeNull();
        fireEvent.click(calendarIcon);
        expect(queryByTestId('datePicker')).toBeNull();
    })
})
