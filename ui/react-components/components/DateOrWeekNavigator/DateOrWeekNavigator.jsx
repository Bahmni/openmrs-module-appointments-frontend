import React, {useState} from "react";
import classNames from "classnames";
import moment from 'moment';
import {
    weekNavigator,
    labelForDate
} from "./DateOrWeekNavigator.module.scss";
import PropTypes from "prop-types";
import {getWeekEndDate, getWeekStartDate} from "../../utils/DateOrWeekNavigator/weekDatesHelper";


const DateOrWeekNavigator = (props) => {

    const {isWeek, weekStart} = props;

    const initialDates = {
        viewDate: moment().format('yyyy-MM-DD'),
        weekStartDate: getWeekStartDate(moment().toDate(), weekStart),
        weekEndDate: getWeekEndDate(moment().toDate(), weekStart)
    };

    const [calendarDates, setCalendarDates] = useState(initialDates);


    const goToPreviousWeek = () => {
        const date = calendarDates.viewDate;
        isWeek ? updateViewDateAndWeekDays(moment(date).subtract(7, "days").format('yyyy-MM-DD'))
            : updateViewDateAndWeekDays(moment(date).subtract(1, "days").format('yyyy-MM-DD'));
    };

    const goToNextWeek = () => {
        const date = calendarDates.viewDate;
        isWeek ? updateViewDateAndWeekDays(moment(date).add(7, "days").format('yyyy-MM-DD'))
            : updateViewDateAndWeekDays(moment(date).add(1, "days").format('yyyy-MM-DD'));;
    };


    const updateViewDateAndWeekDays = (date) => {
        setCalendarDates({
            viewDate: moment(date).format('yyyy-MM-DD'),
            weekStartDate: getWeekStartDate(date, weekStart),
            weekEndDate: getWeekEndDate(date, weekStart)
        });
    };


    return (
        <div className={classNames(weekNavigator)}>
            <button data-testid="leftNavigator" onClick={() => goToPreviousWeek()}>
                <i className="fa fa-angle-left"></i>
            </button>
            <span>
                {isWeek ? <label htmlFor="weekDates"
                                 className={classNames(labelForDate)}>{calendarDates.weekStartDate} - {calendarDates.weekEndDate} </label> : null}
                <input type="date" id="weekDates" value={calendarDates.viewDate}
                       onChange={date => updateViewDateAndWeekDays(date.target.value)} required/>
            </span>
            <button data-testid="rightNavigator" onClick={() => goToNextWeek()}>
                <i className="fa fa-angle-right"></i>
            </button>
        </div>
    );
};


export default DateOrWeekNavigator;


DateOrWeekNavigator.propTypes = {
    isWeek: PropTypes.bool,
    weekStart: PropTypes.number
};
