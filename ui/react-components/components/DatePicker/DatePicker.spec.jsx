import React, {useEffect, useState} from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent, wait, act} from '@testing-library/react';
import AppointmentDatePicker from './DatePicker.jsx';
import moment from 'moment';

describe('DatePicker', () => {
    const ParentWrapper=(props) =>{
        const {value} = props;
        const [dateValue, setDateValue] = useState(value);
        const onChange = (dateVal) => {
            setDateValue(dateVal)};
        useEffect(()=>{
            setDateValue(value);
        },[value]);
        return <AppointmentDatePicker value={dateValue}
                                      onChange={onChange}/>
    }

    it('should render Calendar component ',() => {
        const {container} = render(<AppointmentDatePicker/>);
        expect(container.querySelector('.appointmentDatePicker')).not.toBeNull();
    });

    it('should disable dates before minDate', async () => {
        const minDate = moment();
        const {container} = render(<AppointmentDatePicker minDate={minDate}/>)
        const allDisbaledDates = container.querySelectorAll(`[aria-disabled="true"]`);
        const onlyDateFromMinDate = minDate.date();
        expect(allDisbaledDates.length).toBe(onlyDateFromMinDate-1);
    });

    it('date component should have disable class', () => {
        const {container} = render(<AppointmentDatePicker isDisabled={true}/>);
        expect(container.querySelector('.disable')).not.toBeNull();
    })

    it('should display the date value passed in input field and calendar',()=>{
        const fiveDaysFromToday = moment().add(5, 'days');
        const {container, getByPlaceholderText} = render(<AppointmentDatePicker value={fiveDaysFromToday}/>);
        const dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField.textContent).toBe(fiveDaysFromToday.date().toFixed(0));
        const dateInputField = getByPlaceholderText('mm/dd/yyyy');
        expect(dateInputField.value).toBe(fiveDaysFromToday.format('MM/DD/YYYY'));
    })

    it('should not allow entry of date before min date and should fallback to previously selected date',()=>{
        const fiveDaysFromToday = moment().add(5, 'days');
        const minDate= moment();
        const {container, getByPlaceholderText} = render(<AppointmentDatePicker value={fiveDaysFromToday}
                                                                                minDate={minDate}/>);
        let dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField.textContent).toBe(fiveDaysFromToday.date().toFixed(0));
        const dateInputField = getByPlaceholderText('mm/dd/yyyy');
        expect(dateInputField.value).toBe(fiveDaysFromToday.format('MM/DD/YYYY'));

        fireEvent.change(dateInputField, {target:{value: minDate.subtract(1, 'days')
                    .format('MM/DD/YYYY')}})
        fireEvent.blur(dateInputField);
        dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField.textContent).toBe(fiveDaysFromToday.date().toFixed(0));
        expect(dateInputField.value).toBe(fiveDaysFromToday.format('MM/DD/YYYY'));
    })

    it('should update the calendar and the input field when new valid date is entered inside the input field',()=>{

        const fiveDaysFromToday = moment().add(5, 'days');
        const minDate= moment();
        const newSelectedDate= moment().add(40, 'days');
        const {container, getByPlaceholderText} = render(<ParentWrapper value={fiveDaysFromToday}
                                                                                minDate={minDate}/>);
        let dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField.textContent).toBe(fiveDaysFromToday.date().toFixed(0));
        const dateInputField = getByPlaceholderText('mm/dd/yyyy');
        expect(dateInputField.value).toBe(fiveDaysFromToday.format('MM/DD/YYYY'));

        fireEvent.change(dateInputField, {target:{value: newSelectedDate.format('MM/DD/YYYY')}})
        fireEvent.blur(dateInputField);

        dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField.textContent).toBe(newSelectedDate.date().toFixed(0));
        expect(dateInputField.value).toBe(newSelectedDate.format('MM/DD/YYYY'));
    })

    it('should update the calendar and the input field when new valid date is selected from the calendar view', async ()=>{

        const today = moment();
        const {container, getByPlaceholderText, queryByText} = render(<ParentWrapper value={today}/>);
        let dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField.textContent).toBe(today.date().toFixed(0));

        let dateInputField = getByPlaceholderText('mm/dd/yyyy');
        expect(dateInputField.value).toBe(today.format('MM/DD/YYYY'));

        const nextMonth =today.add(1, 'months');
        const nextButton = container.querySelector('.react-datepicker__navigation--next');
        fireEvent.click(nextButton);
        await wait(() => {
            expect(queryByText(nextMonth.format('MMMM YYYY'))).toBeInTheDocument()
        });
        fireEvent.click(container.querySelector('.react-datepicker__day--001'));
        const selectedDate = nextMonth.startOf('month');
        dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField.textContent).toBe(selectedDate.date().toFixed(0));

        dateInputField = getByPlaceholderText('mm/dd/yyyy');
        expect(dateInputField.value).toBe(selectedDate.format('MM/DD/YYYY'));

    })

    it('should be able to disable the entry of data in calendar and input field when isDisabled is true',() =>{
        const fiveDaysFromToday = moment().add(5, 'days');
        const {container, getByPlaceholderText, getByTestId} = render(<AppointmentDatePicker value={fiveDaysFromToday}
                                                                                isDisabled={true}/>);
        let dateInputField = getByPlaceholderText('mm/dd/yyyy');
        expect(dateInputField.disabled).toBe(true);
        const dateCalendarContainer = getByTestId('datePicker-Calendar');
        expect(dateCalendarContainer).toHaveAttribute('disabled');

    })

    it('should not disable the entry of data in calendar and input field when isDisabled is false',() =>{
        const fiveDaysFromToday = moment().add(5, 'days');
        const {container, getByPlaceholderText, getByTestId} = render(<AppointmentDatePicker value={fiveDaysFromToday}
                                                                                             isDisabled={false}/>);
        let dateInputField = getByPlaceholderText('mm/dd/yyyy');
        expect(dateInputField.disabled).toBe(false);
        const dateCalendarContainer = getByTestId('datePicker-Calendar');
        expect(dateCalendarContainer).not.toHaveAttribute('disabled');
    })

});
