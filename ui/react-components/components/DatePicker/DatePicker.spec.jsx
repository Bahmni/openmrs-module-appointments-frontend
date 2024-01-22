import React, {useEffect, useState} from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent, wait, within} from '@testing-library/react';
import AppointmentDatePicker from './DatePicker.jsx';
import moment from 'moment';
import DatePicker from "react-datepicker";

jest.mock('../../utils/LocalStorageUtil.js', () => ({
    getLocale: jest.fn().mockReturnValue("en-US"),
}));

describe('DatePicker', () => {
    const handleDateSelectionSpy = jest.fn();
    const ParentWrapper=(props) =>{
        const {value} = props;
        const [dateValue, setDateValue] = useState(value);
        const onChange = (dateVal) => {
            setDateValue(dateVal)};
        useEffect(()=>{
            setDateValue(value);
        },[value]);
        return <AppointmentDatePicker value={dateValue}
                                      onChange={onChange}
                                      handleDateSelection={handleDateSelectionSpy}/>
    }

    it('should render Calendar component ',() => {
        const {container} = render(<AppointmentDatePicker/>);
        expect(container.querySelector('.appointmentDatePicker')).not.toBeNull();
    });

    it('should disable dates before minDate', async () => {
        const minDate = moment();
        const {container} = render(<AppointmentDatePicker minDate={minDate}/>)
        const allDisbaledDates = container.querySelectorAll(`[aria-disabled="true"]`);
        const allDatesVisibileInPastMonth = container.getElementsByClassName('react-datepicker__day--outside-month react-datepicker__day--disabled');
        const onlyDateFromMinDate = minDate.date();
        expect(allDisbaledDates.length - allDatesVisibileInPastMonth.length).toBe(onlyDateFromMinDate-1);
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
        const dateInputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(dateInputField.value).toBe(fiveDaysFromToday.format('DD/MMM/YYYY'));
    })

    it('should not allow entry of date before min date and should fallback to previously selected date',()=>{
        const fiveDaysFromToday = moment().add(5, 'days');
        const minDate= moment();
        const {container, getByPlaceholderText} = render(<AppointmentDatePicker value={fiveDaysFromToday}
                                                                                minDate={minDate}/>);
        let dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField.textContent).toBe(fiveDaysFromToday.date().toFixed(0));
        const dateInputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(dateInputField.value).toBe(fiveDaysFromToday.format('DD/MMM/YYYY'));

        fireEvent.change(dateInputField, {target:{value: minDate.subtract(1, 'days')
                    .format('DD/MMM/YYYY')}})
        fireEvent.blur(dateInputField);
        dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField.textContent).toBe(fiveDaysFromToday.date().toFixed(0));
        expect(dateInputField.value).toBe(fiveDaysFromToday.format('DD/MMM/YYYY'));
    })

    it('should update the calendar and the input field when new valid date is entered inside the input field',()=>{

        const fiveDaysFromToday = moment().add(5, 'days');
        const minDate= moment();
        const newSelectedDate= moment().add(40, 'days');
        const {container, getByPlaceholderText} = render(<ParentWrapper value={fiveDaysFromToday}
                                                                                minDate={minDate}/>);
        let dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField.textContent).toBe(fiveDaysFromToday.date().toFixed(0));
        const dateInputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(dateInputField.value).toBe(fiveDaysFromToday.format('DD/MMM/YYYY'));

        fireEvent.change(dateInputField, {target:{value: newSelectedDate.format('DD/MMM/YYYY')}})
        fireEvent.blur(dateInputField);

        dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField.textContent).toBe(newSelectedDate.date().toFixed(0));
        expect(dateInputField.value).toBe(newSelectedDate.format('DD/MMM/YYYY'));
    })

    it('should update the calendar and the input field when new valid date is selected from the calendar view', async ()=>{

        const today = moment();
        const {container, getByPlaceholderText, queryByText} = render(<ParentWrapper value={today}/>);
        let dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField.textContent).toBe(today.date().toFixed(0));

        let dateInputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(dateInputField.value).toBe(today.format('DD/MMM/YYYY'));

        const nextMonth =today.add(1, 'months');
        const nextButton = container.querySelector('.react-datepicker__navigation--next');
        fireEvent.click(nextButton);
        await wait(() => {
            expect(queryByText(nextMonth.format('MMM YYYY'))).toBeInTheDocument()
        });
        fireEvent.click(container.querySelector('.react-datepicker__day--001'));
        const selectedDate = nextMonth.startOf('month');
        dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField.textContent).toBe(selectedDate.date().toFixed(0));

        dateInputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(dateInputField.value).toBe(selectedDate.format('DD/MMM/YYYY'));

    })

    it('should be able to disable the entry of data in calendar and input field when isDisabled is true',() =>{
        const fiveDaysFromToday = moment().add(5, 'days');
        const {container, getByPlaceholderText, getByTestId} = render(<AppointmentDatePicker value={fiveDaysFromToday}
                                                                                isDisabled={true}/>);
        let dateInputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(dateInputField.disabled).toBe(true);
        const dateCalendarContainer = getByTestId('datePicker-Calendar');
        expect(dateCalendarContainer).toHaveAttribute('disabled');

    })

    it('should not disable the entry of data in calendar and input field when isDisabled is false',() =>{
        const fiveDaysFromToday = moment().add(5, 'days');
        const {container, getByPlaceholderText, getByTestId} = render(<AppointmentDatePicker value={fiveDaysFromToday}
                                                                                             isDisabled={false}/>);
        let dateInputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(dateInputField.disabled).toBe(false);
        const dateCalendarContainer = getByTestId('datePicker-Calendar');
        expect(dateCalendarContainer).not.toHaveAttribute('disabled');
    })

    it('should not have any value when the component is disabled', () =>{
        const fiveDaysFromToday = moment().add(5, 'days');
        const {container, getByPlaceholderText, getByTestId} = render(<AppointmentDatePicker value={fiveDaysFromToday}
                                                                                             isDisabled={true}/>);
        let dateInputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(dateInputField.disabled).toBe(true);
        const dateCalendarContainer = getByTestId('datePicker-Calendar');
        expect(dateCalendarContainer).toHaveAttribute('disabled');
        expect(dateInputField.value).toBe('');
        const  dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField).toBeNull();
    })

    it('should show current selected date month and year value in header', () =>{
        const fiveDaysFromToday = moment().add(5, 'days');
        const {container, getByTestId} = render(<AppointmentDatePicker value={fiveDaysFromToday}/>);
        expect(container.querySelector('.appointmentDatePicker')).not.toBeNull();
        const datePickerHeader = getByTestId('date-picker-header-label');
       expect(datePickerHeader.childNodes[0].textContent).toBe(fiveDaysFromToday.format('MMM YYYY'));
    })

    it('should display month year popup when date year label in header is clicked', () =>{
        const fiveDaysFromToday = moment().add(5, 'days');
        const {container, getByTestId, queryByTestId} = render(<AppointmentDatePicker value={fiveDaysFromToday}/>);
        expect(container.querySelector('.appointmentDatePicker')).not.toBeNull();
        const datePickerHeader = getByTestId('date-picker-header-label');
        expect(queryByTestId('month-year-datepicker')).toBeNull();
        fireEvent.click(datePickerHeader.childNodes[0])
        expect(getByTestId('month-year-datepicker')).not.toBeNull();
    })

    it('should show the selected month and year from the month and year popup in header ', () =>{
        const minDate = moment();
        const oneYearFromToday = moment().add(1, 'years');
        const {container, getByTestId, getByText} = render(<AppointmentDatePicker minDate={minDate}/>)
        let datePickerHeader = getByTestId('date-picker-header-label');
        let monthYearHeader = datePickerHeader.childNodes[0];
        expect(monthYearHeader.textContent).toBe(moment().format('MMM YYYY'));
        fireEvent.click(monthYearHeader);
        let nextButton =  getByText('Next Year')
        fireEvent.click(nextButton)
        const firstMonthOfNextYear = container.querySelector('.react-datepicker__month-0');
        fireEvent.click(firstMonthOfNextYear);
        expect(monthYearHeader.textContent).toBe(`Jan ${oneYearFromToday.format('YYYY')}`);
    })

    it('should show the current month and year in header when date is entered in date input', ()=>{
        const fiveDaysFromToday = moment().add(5, 'days');
        const minDate= moment();
        const newSelectedDate= moment().add(40, 'days').add(2, 'months');
        const {container, getByPlaceholderText, getByTestId} = render(<ParentWrapper value={fiveDaysFromToday}
                                                                        minDate={minDate}/>);
        let dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField.textContent).toBe(fiveDaysFromToday.date().toFixed(0));
        const dateInputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(dateInputField.value).toBe(fiveDaysFromToday.format('DD/MMM/YYYY'));

        fireEvent.change(dateInputField, {target:{value: newSelectedDate.format('DD/MMM/YYYY')}})
        fireEvent.blur(dateInputField);

        dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        expect(dateSelectedField.textContent).toBe(newSelectedDate.date().toFixed(0));
        expect(dateInputField.value).toBe(newSelectedDate.format('DD/MMM/YYYY'));

        let datePickerHeader = getByTestId('date-picker-header-label');
        const monthYearHeader = datePickerHeader.childNodes[0];
        expect(monthYearHeader.textContent).toBe(newSelectedDate.format('MMM YYYY'))
    })

    it('should not decrease previous month below given mindate', () =>{
        const minDate = moment();
        const today = moment().add(1, 'months');
        const {container, getByTestId} = render(<AppointmentDatePicker minDate={minDate} value={today}/>)
        let previousButton = container.querySelector('.react-datepicker__navigation--previous');
        let datePickerHeader = getByTestId('date-picker-header-label');
        let monthYearHeader = datePickerHeader.childNodes[0];
        expect(monthYearHeader.textContent).toBe(today.format('MMM YYYY'))
        fireEvent.click(previousButton)
        monthYearHeader = datePickerHeader.childNodes[0];
        expect(monthYearHeader.textContent).toBe(moment().format('MMM YYYY'));
        previousButton = container.querySelector('.react-datepicker__navigation--previous');
        fireEvent.click(previousButton)
        expect(monthYearHeader.textContent).toBe(moment().format('MMM YYYY'));
    })

    it('should allow today month to be selected from header when going ahead in year, select a date & come back', () =>{
        const minDate = moment();
        const oneYearFromToday = moment().add(1, 'years');
        const {container, getByTestId, getByText} = render(<AppointmentDatePicker minDate={minDate}/>)
        let datePickerHeader = getByTestId('date-picker-header-label');
        let monthYearHeader = datePickerHeader.childNodes[0];
        expect(monthYearHeader.textContent).toBe(moment().format('MMM YYYY'));
        fireEvent.click(monthYearHeader);
        let nextButton =  getByText('Next Year');
        fireEvent.click(nextButton)
        const firstMonthOfNextYear = container.querySelector('.react-datepicker__month-0');
        fireEvent.click(firstMonthOfNextYear);
        expect(monthYearHeader.textContent).toBe(`Jan ${oneYearFromToday.format('YYYY')}`);
        fireEvent.click(monthYearHeader);
        let previousButton = container.querySelector('.react-datepicker__navigation--previous');
        fireEvent.click(previousButton);

        let lastMonthOfCurrentYear = container.querySelector('.react-datepicker__month-11');
        fireEvent.click(lastMonthOfCurrentYear);
        expect(monthYearHeader.textContent).toBe(`Dec ${moment().format('YYYY')}`);

    })

    it('should take us to the date today from someother month or year when today icon is clicked on header', () =>{
        const minDate = moment();
        const firstMonthOfNextYear = moment().startOf('year').add(1, 'years');
        const {container, getByTestId,getByText} = render(<AppointmentDatePicker minDate={minDate}/>)
        let datePickerHeader = getByTestId('date-picker-header-label');
        let monthYearHeader = datePickerHeader.childNodes[0];
        expect(monthYearHeader.textContent).toBe(moment().format('MMM YYYY'));
        fireEvent.click(monthYearHeader);
        let nextButton =  getByText('Next Year')
        fireEvent.click(nextButton)
        const firstMonthOfNextYearComponent = container.querySelector('.react-datepicker__month-0');
        fireEvent.click(firstMonthOfNextYearComponent);
        expect(monthYearHeader.textContent).toBe(`Jan ${firstMonthOfNextYear.format('YYYY')}`);
        const goToTodayButton = getByTestId('go-to-today');
        fireEvent.click(goToTodayButton);
        expect(monthYearHeader.textContent).toBe(moment().format('MMM YYYY'));
        const dayTodayButton = container.querySelector('.react-datepicker__day--today');
        expect(dayTodayButton.textContent).toBe(moment().format('D'));

    })

    it('should call handleDateSelection and close date picker on selection of date', function () {
        const today = moment();
        const {container} = render(<ParentWrapper value={today} handleDateSelection={handleDateSelectionSpy}/>);
        let dateSelectedField = container.querySelector('.react-datepicker__day--selected');
        fireEvent.click(container.querySelector('.react-datepicker__day--001'));
        expect(handleDateSelectionSpy).toHaveBeenCalledWith();
        expect(dateSelectedField.textContent).toBe(today.date().toFixed(0));
        expect(container.querySelector('react-datepicker')).toBeNull();
    });

});
