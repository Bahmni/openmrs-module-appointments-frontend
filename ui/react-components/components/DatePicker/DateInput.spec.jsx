import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent } from '@testing-library/react';
import moment from "moment";
import DateInput from "./DateInput";

describe('Date Input', ()=>{
    let onBlurSpy;
    beforeEach(() => {
        onBlurSpy= jest.fn();
    });
    it('should have placeholder dd/mmm/yyy',()=>{
        const {container, getByPlaceholderText} = render(<DateInput onBlur={onBlurSpy}/>);
        expect(getByPlaceholderText('dd/mmm/yyyy')).not.toBeNull();
    })

    it('should have a x symbol to clear',()=>{
        const today = moment().format('DD/MMM/YYYY');
        const {container, getByPlaceholderText, getByText} = render(<DateInput value={today} onBlur={onBlurSpy}/>);
        const closeButton = getByText('x');
        const inputValue = getByPlaceholderText('dd/mmm/yyyy');
        expect(inputValue.value).toBe(today);
        fireEvent.click(closeButton);
        expect(inputValue.value).toBe('');
        expect(onBlurSpy).toHaveBeenCalledWith('')
    })

    it('should accept date value only in dd/mmm/yyyy or mm-dd-yyyy format', ()=>{
        const today = moment().format('DD, MMM YYYY');
        const {container, getByPlaceholderText, getByText} = render(<DateInput value={today} onBlur={onBlurSpy}/>);
        const inputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(inputField.value).toBe('');
        const todayInUSDateFormat= moment().format('DD/MMMM/YYYY');
        fireEvent.change(inputField, {target:{value:todayInUSDateFormat}})
        expect(inputField.value).toBe(todayInUSDateFormat);
        const todayInUSDateFormatWithDash= moment().format('DD-MMM-YYYY');
        fireEvent.change(inputField, {target:{value:todayInUSDateFormatWithDash}})
        expect(inputField.value).toBe(todayInUSDateFormatWithDash);
    })

    it('should not call onBlur with new date value if new date is invalid', ()=>{
        const today = moment().format('DD/MMM/YYYY');
        const invalidDate = 'abc';
        const {container, getByPlaceholderText, getByText} = render(<DateInput value={today} onBlur={onBlurSpy}/>);
        const closeButton = getByText('x');
        const inputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(inputField.value).toBe(today);
        fireEvent.change(inputField, {target:{value:invalidDate}});
        fireEvent.blur(inputField);
        expect(inputField.value).toBe(today);
        expect(onBlurSpy).not.toHaveBeenCalledWith(today)
    })

    it('should call onBlur with new date value if new date is valid', ()=>{
        const today = moment().format('DD/MMM/YYYY');
        const validDate = today;
        const {container, getByPlaceholderText, getByText} = render(<DateInput value='' onBlur={onBlurSpy}/>);
        const closeButton = getByText('x');
        const inputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(inputField.value).toBe('');
        fireEvent.change(inputField, {target:{value:validDate}});
        fireEvent.blur(inputField);
        expect(onBlurSpy).toHaveBeenCalledWith(validDate)
    })

    it('should not allow a date below the given min date value', ()=>{
        const today = moment().format('DD/MMM/YYYY');
        const minDate= moment().toDate();
        const validDate = today;
        const {container, getByPlaceholderText, getByText} = render(<DateInput value='' onBlur={onBlurSpy}
                                                                               minDate={minDate}/>);
        const dateBeforeToday = moment().subtract(2, "days");
        const inputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(inputField.value).toBe('');
        fireEvent.change(inputField, {target:{value:dateBeforeToday.format('DD/MMM/YYYY')}});
        fireEvent.blur(inputField);
        expect(inputField.value).toBe('');
    })

    it('should  allow a date after the given min date value', ()=>{
        const today = moment().format('DD/MMM/YYYY');
        const minDate= moment().toDate();
        const validDate = today;
        const {container, getByPlaceholderText, getByText} = render(<DateInput value='' onBlur={onBlurSpy}
                                                                               minDate={minDate}/>);
        const dateAfterToday = moment().add(2, "days");
        const inputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(inputField.value).toBe('');
        const fomatedDateAfterToday = dateAfterToday.format('DD/MMM/YYYY');
        fireEvent.change(inputField, {target:{value: fomatedDateAfterToday}});
        fireEvent.blur(inputField);
        expect(inputField.value).toBe(fomatedDateAfterToday);
    })

    it('should  allow date as the given min date value', ()=>{
        const today = moment();
        const minDate= today.toDate();
        const validDate = today;
        const {container, getByPlaceholderText, getByText} = render(<DateInput value='' onBlur={onBlurSpy}
                                                                               minDate={minDate}/>);
        const inputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(inputField.value).toBe('');
        const formatedMinDate = today.format('DD/MMM/YYYY');
        fireEvent.change(inputField, {target:{value: formatedMinDate}});
        fireEvent.blur(inputField);
        expect(inputField.value).toBe(formatedMinDate);
    })


    it('should not allow a date above the given max date value', ()=>{
        const oneDayAfterToday = moment().add(1, 'days').format('DD/MMM/YYYY');
        const maxDate= moment().add(1, 'days').toDate();
        const validDate = oneDayAfterToday;
        const {container, getByPlaceholderText, getByText} = render(<DateInput value='' onBlur={onBlurSpy}
                                                                               maxDate={maxDate}/>);
        const twoDayAfterToday = moment().add(2, "days");
        const inputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(inputField.value).toBe('');
        fireEvent.change(inputField, {target:{value:twoDayAfterToday.format('DD/MMM/YYYY')}});
        fireEvent.blur(inputField);
        expect(inputField.value).toBe('');
    })

    it('should  allow a date before the given max date value', ()=>{
        const today = moment().format('DD/MMM/YYYY');
        const maxDate= moment().add(2, 'days').toDate();
        const validDate = today;
        const {container, getByPlaceholderText, getByText} = render(<DateInput value='' onBlur={onBlurSpy}
                                                                               maxDate={maxDate}/>);
        const dateAfterToday = moment().add(1, "days");
        const inputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(inputField.value).toBe('');
        const fomatedDateAfterToday = dateAfterToday.format('DD/MMM/YYYY');
        fireEvent.change(inputField, {target:{value: fomatedDateAfterToday}});
        fireEvent.blur(inputField);
        expect(inputField.value).toBe(fomatedDateAfterToday);
    })

    it('should  allow date as the given max date value', ()=>{
        const today = moment();
        const maxDate= today.toDate();
        const validDate = today;
        const {container, getByPlaceholderText, getByText} = render(<DateInput value='' onBlur={onBlurSpy}
                                                                               maxDate={maxDate}/>);
        const inputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(inputField.value).toBe('');
        const formatedMinDate = today.format('DD/MMM/YYYY');
        fireEvent.change(inputField, {target:{value: formatedMinDate}});
        fireEvent.blur(inputField);
        expect(inputField.value).toBe(formatedMinDate);
    })

    it('should not allow the value to be editable if disabled is true',()=>{
        const {container, getByPlaceholderText, getByText} = render(<DateInput value='' onBlur={onBlurSpy}
                                                                               isDisabled={true}/>);
        const inputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(inputField.disabled).toBe(true);
    })

    it('should not allow the value to be cleared if disabled is true',()=>{
        const today = moment().format('DD/MMM/YYYY');
        const {container, getByPlaceholderText, getByText} = render(<DateInput value={today} onBlur={onBlurSpy}
                                                                               isDisabled={true}/>);
        const inputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(inputField.disabled).toBe(true);
        const closeButton = getByText('x');
        fireEvent.click(closeButton);
        expect(inputField.value).toBe(today);
        expect(onBlurSpy).not.toHaveBeenCalled()
    })

    it('should  allow the value to be editable if disabled is false',()=>{
        const {container, getByPlaceholderText, getByText} = render(<DateInput value='' onBlur={onBlurSpy}
                                                                               isDisabled={false}/>);
        const inputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(inputField.disabled).toBe(false);
    })

    it('should  allow the value to be editable if disabled is not passed',()=>{
        const {container, getByPlaceholderText, getByText} = render(<DateInput value='' onBlur={onBlurSpy}/>);
        const inputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(inputField.disabled).toBe(false);
    })

    it('should set the date to empty string when invalid date is entered',()=>{
        const {container, getByPlaceholderText, getByText} = render(<DateInput onBlur={onBlurSpy}/>);
        const inputField = getByPlaceholderText('dd/mmm/yyyy');
        expect(inputField.value).toBe('');
        fireEvent.change(inputField, {target:{value:'322'}});
        fireEvent.blur(inputField);
        expect(inputField.value).toBe('')
        expect(onBlurSpy).toHaveBeenCalledWith('')
    })
})