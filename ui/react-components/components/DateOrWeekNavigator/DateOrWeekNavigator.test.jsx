import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent } from '@testing-library/react';
import moment from "moment";
import DateOrWeekNavigator from "./DateOrWeekNavigator";
import {renderWithReactIntl} from "../../utils/TestUtil";
import {AppContext} from "../AppContext/AppContext";

describe('DateOrWeekNavigator', ()=>{

    it('should have today as default date and current week startDate and endDate displayed for week view on page load',()=>{
        const today = moment().format('YYYY-MM-DD');
        const {container} = renderWithReactIntl(<DateOrWeekNavigator isWeek={true} weekStart={7}/>);
        const inputValue = container.querySelector('#weekDates');
        expect(inputValue.value).toBe(today);
        const labelOnDatePicker = container.querySelector(".labelForDate");
        expect(labelOnDatePicker).not.toBeNull();
    });

    it('should have today as default date and no week startDate and endDate be displayed for day view ',()=>{
        const today = moment().format('YYYY-MM-DD');
        const {container} = renderWithReactIntl(<DateOrWeekNavigator isWeek={false} weekStart={7}/>);
        const inputValue = container.querySelector('#weekDates');
        expect(inputValue.value).toBe(today);
        const labelOnDatePicker = container.querySelector(".labelForDate");
        expect(labelOnDatePicker).toBeNull();
    });

    it('should update the input value and corresponding week startDate and endDate when date is changed', ()=>{
        const today= moment().format('YYYY-MM-DD');
        const {container} = renderWithReactIntl(
            <AppContext.Provider value={{ setStartDate: jest.fn(), setEndDate:jest.fn() }}>
                <DateOrWeekNavigator isWeek={true} weekStart={7}/>
            </AppContext.Provider>
        );
        const inputField = container.querySelector('#weekDates');
        expect(inputField.value).toBe(today);
        const newDate= moment("15-07-2020", 'DD-MM-YYYY').format('YYYY-MM-DD');
        fireEvent.change(inputField, {target:{value:newDate}});
        expect(inputField.value).toBe(newDate);
        const labelOnDatePicker = container.querySelector(".labelForDate");
        expect(labelOnDatePicker).toHaveTextContent("12 Jul - 18 Jul");
    });

    it('should update only input value when date is changed in day view', ()=>{
        const today= moment().format('YYYY-MM-DD');
        const {container} = renderWithReactIntl(
            <AppContext.Provider value={{ setStartDate: jest.fn(), setEndDate:jest.fn() }}>
                <DateOrWeekNavigator isWeek={false} weekStart={7}/>
            </AppContext.Provider>);
        const inputField = container.querySelector('#weekDates');
        expect(inputField.value).toBe(today);
        const newDate= moment("15-07-2020", 'DD-MM-YYYY').format('YYYY-MM-DD');
        fireEvent.change(inputField, {target:{value:newDate}});
        expect(inputField.value).toBe(newDate);
        const labelOnDatePicker = container.querySelector(".labelForDate");
        expect(labelOnDatePicker).toBeNull();
    });

    it('should display previous week values for selected date when clicked on left navigator', ()=>{
        const {container, getByTestId} = renderWithReactIntl(
            <AppContext.Provider value={{ setStartDate: jest.fn(), setEndDate:jest.fn() }}>
                <DateOrWeekNavigator isWeek={true} weekStart={7}/>
            </AppContext.Provider>);
        const inputField = container.querySelector('#weekDates');
        const selectDate= moment("15-07-2020", 'DD-MM-YYYY').format('YYYY-MM-DD');
        fireEvent.change(inputField, {target:{value:selectDate}});
        const previousWeekNavigator = getByTestId("leftNavigator");
        const previousWeekDate = moment(selectDate).subtract(7, "days").format('YYYY-MM-DD');
        fireEvent.click(previousWeekNavigator);
        expect(inputField.value).toBe(previousWeekDate);
        const labelOnDatePicker = container.querySelector(".labelForDate");
        expect(labelOnDatePicker).toHaveTextContent("05 Jul - 11 Jul");

    });

    it('should display previous date for selected date when clicked on left navigator', ()=>{
        const {container, getByTestId} = renderWithReactIntl(
            <AppContext.Provider value={{ setStartDate: jest.fn(), setEndDate:jest.fn() }}>
                <DateOrWeekNavigator isWeek={false} weekStart={7}/>
            </AppContext.Provider>);
        const inputField = container.querySelector('#weekDates');
        const selectDate= moment("15-07-2020", 'DD-MM-YYYY').format('YYYY-MM-DD');
        fireEvent.change(inputField, {target:{value:selectDate}});
        const previousDayNavigator = getByTestId("leftNavigator");
        const previousDate = moment(selectDate).subtract(1, "days").format('YYYY-MM-DD');
        fireEvent.click(previousDayNavigator);
        expect(inputField.value).toBe(previousDate);
        const labelOnDatePicker = container.querySelector(".labelForDate");
        expect(labelOnDatePicker).toBeNull();

    });

    it('should display next week values for selected date when clicked on right navigator', ()=>{
        const {container, getByTestId} = renderWithReactIntl(
            <AppContext.Provider value={{ setStartDate: jest.fn(), setEndDate:jest.fn() }}>
                <DateOrWeekNavigator isWeek={true} weekStart={7}/>
            </AppContext.Provider>);
        const inputField = container.querySelector('#weekDates');
        const selectDate= moment("15-07-2020", 'DD-MM-YYYY').format('YYYY-MM-DD');
        fireEvent.change(inputField, {target:{value:selectDate}});
        const nextWeekNavigator = getByTestId("rightNavigator");
        const nextWeekDate = moment(selectDate).add(7, "days").format('YYYY-MM-DD');
        fireEvent.click(nextWeekNavigator);
        expect(inputField.value).toBe(nextWeekDate);
        const labelOnDatePicker = container.querySelector(".labelForDate");
        expect(labelOnDatePicker).toHaveTextContent("19 Jul - 25 Jul");

    });

    it('should display next date for selected date when clicked on right navigator', ()=>{
        const {container, getByTestId} = renderWithReactIntl(
            <AppContext.Provider value={{ setStartDate: jest.fn(), setEndDate:jest.fn() }}>
                <DateOrWeekNavigator isWeek={false} weekStart={7}/>
            </AppContext.Provider>);
        const inputField = container.querySelector('#weekDates');
        const selectDate= moment("15-07-2020", 'DD-MM-YYYY').format('YYYY-MM-DD');
        fireEvent.change(inputField, {target:{value:selectDate}});
        const nextDayNavigator = getByTestId("rightNavigator");
        const nextDate = moment(selectDate).add(1, "days").format('YYYY-MM-DD');
        fireEvent.click(nextDayNavigator);
        expect(inputField.value).toBe(nextDate);
        const labelOnDatePicker = container.querySelector(".labelForDate");
        expect(labelOnDatePicker).toBeNull();
    });

});