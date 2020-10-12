import React, {useState} from "react";
import classNames from "classnames";
import moment from 'moment';
import {
    weekNavigator,
    labelForDate
} from "./DateOrWeekNavigator.module.scss";
import PropTypes from "prop-types";
import {getWeekEndDate, getWeekStartDate, getFormattedWeekStartDate} from "../../utils/DateOrWeekNavigator/weekDatesHelper";


const DateOrWeekNavigator = (props) => {

    const {isWeek, weekStart, onWeekStartDateChange, userDefinedClassname} = props;

    const initialDates = {
        viewDate: moment().format('YYYY-MM-DD'),
        weekStartDate: getWeekStartDate(moment().toDate(), weekStart),
        weekEndDate: getWeekEndDate(moment().toDate(), weekStart)
    };

    const [calendarDates, setCalendarDates] = useState(initialDates);


    const goToPreviousWeek = (onWeekStartDateChange) => {
        const date = calendarDates.viewDate;
        isWeek ? updateViewDateAndWeekDays(moment(date).subtract(7, "days").format('YYYY-MM-DD'), onWeekStartDateChange)
            : updateViewDateAndWeekDays(moment(date).subtract(1, "days").format('YYYY-MM-DD'), onWeekStartDateChange);
    };

    const goToNextWeek = (onWeekStartDateChange) => {
        const date = calendarDates.viewDate;
        isWeek ? updateViewDateAndWeekDays(moment(date).add(7, "days").format('YYYY-MM-DD'), onWeekStartDateChange)
            : updateViewDateAndWeekDays(moment(date).add(1, "days").format('YYYY-MM-DD'), onWeekStartDateChange);;
    };


    const updateViewDateAndWeekDays = (date, onWeekStartDateChange) => {
        const updatedDates = {
            viewDate: moment(date).format('YYYY-MM-DD'),
            weekStartDate: getWeekStartDate(date, weekStart),
            weekEndDate: getWeekEndDate(date, weekStart)
        }
        setCalendarDates(updatedDates);

        if(onWeekStartDateChange) {
            onWeekStartDateChange(getFormattedWeekStartDate(date, weekStart));
        }
    };

    return (
        <div className={classNames(weekNavigator, userDefinedClassname)}>
            <button data-testid="leftNavigator" onClick={() => goToPreviousWeek(onWeekStartDateChange)}>
                <i className="fa fa-angle-left"></i>
            </button>
            <span>
                {isWeek ? <label htmlFor="weekDates"
                                 className={classNames(labelForDate)}>{calendarDates.weekStartDate} - {calendarDates.weekEndDate} </label> : null}
                <input type="date" id="weekDates" value={calendarDates.viewDate}
                       onChange={date => updateViewDateAndWeekDays(date.target.value, onWeekStartDateChange)} required/>
            </span>
            <button data-testid="rightNavigator" onClick={() => goToNextWeek(onWeekStartDateChange)}>
                <i className="fa fa-angle-right"></i>
            </button>
        </div>
    );
};


export default DateOrWeekNavigator;


DateOrWeekNavigator.propTypes = {
    isWeek: PropTypes.bool,
    weekStart: PropTypes.number,
    onWeekStartDateChange: PropTypes.func
};
