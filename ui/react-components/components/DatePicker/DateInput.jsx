import React, {useState, useEffect, useRef} from 'react';
import{
    dateTextHolder,
    dateInputClear,
    dateInputBox,
    disable
} from './DateInput.module.scss'
import classNames from 'classnames';
import {isValidDate} from '../../utils/DateUtil'
import PropTypes from "prop-types";
import moment from "moment";
import {isNil} from 'lodash'

const DateInput = (props) =>{
    const validateDate= ({dateValue, minDate, maxDate}) =>{
        const isDateFormatValid = isValidDate(dateValue) || dateValue==='';
        if(minDate && isDateFormatValid && dateValue!== ''){
          if( moment(dateValue, 'DD/MMM/YYYY').isBefore(moment(minDate).startOf('day'))) {
              return false;
          }
        }
        if(maxDate && isDateFormatValid && dateValue!== ''){
            if( moment(dateValue, 'DD/MMM/YYYY').isAfter(moment(maxDate).startOf('day'))) {
                return false;
            }
        }
        return isDateFormatValid;
    };

    const inputRef = useRef(null);
    const {value, onBlur, minDate, maxDate, isDisabled, handleTab} = props;
    const [componentValue, setComponentValue] = useState(validateDate({dateValue: value, minDate,maxDate})? value:'');
    useEffect(() => {
        setComponentValue(validateDate({dateValue: value, minDate,maxDate})?value:'');
    }, [value, minDate]);

    const handleBlur=(e) =>{
        const inputValue = e.target.value;
        const isValidDate = validateDate({dateValue: inputValue, minDate, maxDate});
        if (isValidDate) {
            onBlur(componentValue);
        } else if (isNil(value)) {
            onBlur('');
            setComponentValue('')
        } else {
            setComponentValue(value);
            inputRef.current.focus();
        }
    };

    const handleClear = (e) =>{
        if(!isDisabled) {
            setComponentValue('');
            onBlur('');
            inputRef.current.focus();
        }
    };

    const handleKeyDown= (e) => {
        if (e.key === 'Enter') {
            inputRef.current.blur();
            const inputValue = e.target.value;
            const isValidDate = validateDate({dateValue: inputValue, minDate, maxDate});
            if (isValidDate)
                handleTab && handleTab();
        }
        else if(e.key === 'Tab')
            handleTab && handleTab();
    };

    const inputClearStyles= [dateInputClear];
    isDisabled && inputClearStyles.push(disable);

    const inputFieldStyles= [dateInputBox];
    isDisabled && inputFieldStyles.push(disable);

    return(
        <div className={classNames(dateTextHolder)}>
            <input placeholder="dd/mmm/yyyy" onChange={(e) => setComponentValue(e.target.value)}
                   className={classNames(inputFieldStyles)}
                   onKeyDown={handleKeyDown}
                   ref={inputRef}
                   disabled={isDisabled}
                   onBlur={handleBlur} value={componentValue}/>
             <span data-testid='clear-date-input' className={classNames(inputClearStyles)} onClick={handleClear}>x</span>
        </div>
    )
}

DateInput.propTypes = {
    onBlur: PropTypes.func.isRequired,
    value: PropTypes.string,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    isDisabled: PropTypes.bool,
    handleTab: PropTypes.func
};

export default DateInput;
