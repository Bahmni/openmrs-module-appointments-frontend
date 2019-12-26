import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, {useState} from "react";
import moment from "moment";
import classNames from 'classnames';
import{
    monthYearDropdownLabel,
    monthYearDatePicker,
    arrow,
    currentDateCircle,
    disable,
    monthYearDatePickerContainer
} from './DatePickerCustomHeader.module.scss'
import {isNil} from 'lodash';
import PropTypes from "prop-types";
const DatePickerCustomHeader = (props) => {
    const [showMonthYear, setShowMonthYear] = useState(false)
    const {date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
        minDate,
        currentDate}= props;
    const isCurrentDateNotSelected = isNil(currentDate);
    const prevMonthArrowStyles=[arrow]
    prevMonthButtonDisabled && prevMonthArrowStyles.push(disable)
    const currentCircleStyle=[currentDateCircle]
    isCurrentDateNotSelected && currentCircleStyle.push(disable);

    const goToCurrentSelectedDate = () => {
        if (!isCurrentDateNotSelected) {
            changeYear(moment(currentDate).year())
            changeMonth(moment(currentDate).month())
        }
    };

    return <div>
         <span data-testid="date-picker-header-label" className={classNames(monthYearDropdownLabel)} onClick={() =>{setShowMonthYear(!showMonthYear)}}>
                <label>{moment(date).format('MMMM YYYY')}</label>
                <span >
                    <i className={classNames('fa','fa-angle-down')} aria-hidden="true"></i>
                </span>
         </span>
        <span onClick={()=>{if(!prevMonthButtonDisabled) decreaseMonth()}}
              className={classNames('react-datepicker__navigation--previous')}
              disabled={prevMonthButtonDisabled}>
            <i className={classNames('fa','fa-caret-left', prevMonthArrowStyles)} aria-hidden="true"></i>
        </span>
        <span onClick={ goToCurrentSelectedDate} disabled={isCurrentDateNotSelected}>
            <i className={classNames('fa','fa-circle', currentCircleStyle)} aria-hidden="true"></i>
        </span>
        <span onClick={increaseMonth} disabled={nextMonthButtonDisabled} className={classNames('react-datepicker__navigation--next')}>
            <i className={classNames('fa','fa-caret-right', arrow)} aria-hidden="true"></i>
        </span>
        {showMonthYear && <div data-testid='month-year-datepicker' className={classNames(monthYearDatePickerContainer)}> <DatePicker
            selected={date}
            onChange={(date) => {
                changeYear(moment(date).year())
                changeMonth(moment(date).month())
                setShowMonthYear(false);
            }}
            calendarClassName={classNames(monthYearDatePicker)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            inline
            minDate={minDate}
        /></div>}
    </div>
}

DatePickerCustomHeader.propTypes = {
    date: PropTypes.instanceOf(Date),
    changeYear:PropTypes.func,
    changeMonth:PropTypes.func,
    decreaseMonth:PropTypes.func,
    increaseMonth:PropTypes.func,
    prevMonthButtonDisabled:PropTypes.bool,
    nextMonthButtonDisabled:PropTypes.bool,
    minDate:PropTypes.instanceOf(Date),
    currentDate: PropTypes.instanceOf(Date)
};


export default DatePickerCustomHeader;

