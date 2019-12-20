import React, {useState, useEffect, useRef} from 'react';
import{
    dateInputClose,
    dateInputBox
} from './DateInput.module.scss'
import classNames from 'classnames';
import {isValidUSDate} from '../../utils/DateUtil'
import PropTypes from "prop-types";
import moment from "moment";

const DateInput = (props) =>{
    const validateDate= ({dateValue, minDate, maxDate}) =>{
        const isDateFormatValid = isValidUSDate(dateValue) || dateValue==='';
        if(minDate && isDateFormatValid && dateValue!== ''){
          if( moment(dateValue, 'MM/DD/YYYY').isBefore(moment(minDate).startOf('day'))) {
              return false;
          }
        }
        if(maxDate && isDateFormatValid && dateValue!== ''){
            if( moment(dateValue, 'MM/DD/YYYY').isAfter(moment(maxDate).startOf('day'))) {
                return false;
            }
        }
        return isDateFormatValid;
    }
    const inputRef = useRef(null);
    const {value, onBlur, minDate, maxDate, isDisabled} = props;
    const [componentValue, setComponentValue] = useState(validateDate({dateValue: value, minDate,maxDate})? value:'');
    useEffect(() => {
        setComponentValue(validateDate({dateValue: value, minDate,maxDate})?value:'');
    }, [value, minDate]);

    const handleBlur=(e) =>{
        const inputValue = e.target.value;
        const isValidDate = validateDate({dateValue: inputValue, minDate,maxDate});
        if(isValidDate){
            onBlur(componentValue);
        }else {
            setComponentValue(value)
        }
    }

    const handleClear = (e) =>{
        setComponentValue('')
        onBlur('')
    }

    const handleKeyDown= (e) => {
        if (e.key === 'Enter') {
           inputRef.current.blur();
        }
    }
    return(
        <div>
            <input placeholder="mm/dd/yyyy" onChange={(e) => setComponentValue(e.target.value)}
                   className={classNames(dateInputBox)}
                   onKeyDown={handleKeyDown}
                   ref={inputRef}
                   disabled={isDisabled}
                   onBlur={handleBlur} value={componentValue}/>
             <span className={classNames(dateInputClose)} onClick={handleClear}>x</span>
        </div>
    )
}

DateInput.propTypes = {
    onBlur: PropTypes.func.isRequired,
    value: PropTypes.string,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    isDisabled: PropTypes.bool
};

export default DateInput;