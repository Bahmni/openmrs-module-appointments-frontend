import React, {useEffect, useRef, useState} from 'react';
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    appointmentDatePicker,
    disable,
    disabledDate
} from './DatePicker.module.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import DateInput from './DateInput.jsx';
import DatePickerCustomHeader from './DatePickerCustomHeader.jsx';
import {getUserLocale} from "../../utils/DateUtil";

let locale = getUserLocale();
if (locale) {
    registerLocale(locale.code, locale);
}

const dateToMomentDate = (date) => date === '' || date === null || date === undefined ? date
    : moment(date, 'DD/MMM/YYYY');
const AppointmentDatePicker = (props) => {
    const {minDate, value, onChange, isDisabled, handleDateSelection} = props;
    let calendarStyles = [appointmentDatePicker];
    isDisabled && calendarStyles.push(disable);
    const selectedDate = value ? value.toDate() : value;

    let containerStyles = [];
    isDisabled && containerStyles.push(disable);

    const handleBlurOfDateInput = (date) => {
        const valueEntered = dateToMomentDate(date);
        onChange(valueEntered);
    };

    const dateInputValue = isDisabled ? '' : (value && value !== '' ? value.format('DD/MMM/YYYY') : value);

    return (
        <div data-testid="datePicker" className={classNames(containerStyles)}>
            <DateInput value={dateInputValue}
                       minDate={minDate && minDate.toDate()}
                       isDisabled={isDisabled}
                       onBlur={handleBlurOfDateInput}
                       handleTab={handleDateSelection}
            />
            <div disabled={isDisabled} data-testid="datePicker-Calendar"><DatePicker
                selected={isDisabled ? '' : selectedDate}
                onSelect={() => handleDateSelection && handleDateSelection()}
                onChange={(date) => onChange(dateToMomentDate(date))}
                inline
                fixedHeight
                locale={locale?locale.code:"en-US"}
                readOnly={true}
                calendarClassName={calendarStyles}
                minDate={minDate && minDate.toDate()}
                dayClassName={() => {if(isDisabled) return classNames(disabledDate)}}
                renderCustomHeader={(params) => {
                    return (<DatePickerCustomHeader {...params}
                                                    minDate={minDate && minDate.toDate()}
                                                    locale={locale?locale.code:"en-US"}
                                                    currentDate={selectedDate}

                        />
                    )
                }}
            /></div>
        </div>
    );
};

AppointmentDatePicker.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.instanceOf(moment),
    minDate: PropTypes.instanceOf(moment),
    isDisabled: PropTypes.bool,
    handleDateSelection: PropTypes.func
};

export default AppointmentDatePicker;
