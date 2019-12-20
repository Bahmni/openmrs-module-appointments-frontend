import React, {useEffect, useState} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    appointmentDatePicker,
    disable,
    disabledDate
} from './DatePicker.module.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import DateInput from './DateInput.jsx'

const datetoMomentDate = (date) => date==='' || date===null || date === undefined ? date
    : moment(date,'MM/DD/YYYY' );
const AppointmentDatePicker = (props) => {
    const {minDate, value, onChange, isDisabled} = props;
    let calendarStyles =[appointmentDatePicker];
    isDisabled && calendarStyles.push(disable);
    const selectedDate = value?  value.toDate() : value;

    let containerStyles=[];
    isDisabled && containerStyles.push(disable);

    const handleBlurOfDateInput = (date) =>{
        const valueEntered= datetoMomentDate(date);
        onChange(valueEntered)
    };

    const dateInputValue = isDisabled? '' : (value && value!=='' ? value.format('MM/DD/YYYY') : value);

    return (
        <div data-testid="datePicker" className={classNames(containerStyles)}>
           <DateInput value={dateInputValue}
                      minDate={minDate && minDate.toDate()}
                      isDisabled={isDisabled}
                      onBlur={handleBlurOfDateInput}/>
           <div disabled={isDisabled} data-testid="datePicker-Calendar"> <DatePicker
                selected={isDisabled? '' : selectedDate}
                onChange={(date) =>onChange(datetoMomentDate(date))}
                inline
                readOnly={true}
                calendarClassName={calendarStyles}
                minDate={minDate && minDate.toDate()}
                dayClassName={() => {if(isDisabled) return classNames(disabledDate)}}
           /></div>
        </div>
    );
};

AppointmentDatePicker.propTypes = {
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    value: PropTypes.instanceOf(moment),
    minDate: PropTypes.instanceOf(moment),
    isDisabled: PropTypes.bool
};

export default AppointmentDatePicker;
