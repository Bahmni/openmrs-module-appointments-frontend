import React, {useState} from "react";
import classNames from "classnames";
import moment from 'moment';
import {
    weekNavigator,
    labelForDate
} from "./DateOrWeekNavigator.module.scss";
import PropTypes from "prop-types";
import {getWeekEndDate, getWeekStartDate} from "../../utils/DateOrWeekNavigator/weekDatesHelper";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {AppContext} from "../AppContext/AppContext";

const DateOrWeekNavigator = (props) => {

    const { isWeek, weekStart } = props;
    let { setStartDate, setEndDate } = React.useContext(AppContext);

    const initialDates = {
        viewDate: moment().format('YYYY-MM-DD'),
        weekStartDate: getWeekStartDate(moment().toDate(), weekStart).format('DD MMM'),
        weekEndDate: getWeekEndDate(moment().toDate(), weekStart).format('DD MMM')
    };

    const [calendarDates, setCalendarDates] = useState(initialDates);


    const goToPreviousWeek = () => {
        const date = calendarDates.viewDate;
        isWeek ? updateViewDateAndWeekDays(moment(date).subtract(7, "days").format('YYYY-MM-DD'))
            : updateViewDateAndWeekDays(moment(date).subtract(1, "days").format('YYYY-MM-DD'));
    };

    const goToNextWeek = () => {
        const date = calendarDates.viewDate;
        isWeek ? updateViewDateAndWeekDays(moment(date).add(7, "days").format('YYYY-MM-DD'))
            : updateViewDateAndWeekDays(moment(date).add(1, "days").format('YYYY-MM-DD'));;
    };


    const updateViewDateAndWeekDays = (date) => {
        const startDate = getWeekStartDate(date, weekStart);
        const endDate = getWeekEndDate(date, weekStart)
        setCalendarDates({
            viewDate: moment(date).format('YYYY-MM-DD'),
            weekStartDate: startDate.format('DD MMM'),
            weekEndDate: endDate.format('DD MMM')
        });
        setStartDate(startDate)
        setEndDate(endDate)
    };


    return (
        <div className={classNames(weekNavigator)}>
            <button data-testid="leftNavigator" onClick={() => goToPreviousWeek()}>
                <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <span>
                {isWeek ? <label htmlFor="weekDates"
                                 className={classNames(labelForDate)}>{calendarDates.weekStartDate} - {calendarDates.weekEndDate} </label> : null}
                <input type="date" id="weekDates" value={calendarDates.viewDate}
                       onChange={date => updateViewDateAndWeekDays(date.target.value)} required/>
            </span>
            <button data-testid="rightNavigator" onClick={() => goToNextWeek()}>
                <FontAwesomeIcon icon={faAngleRight} />
            </button>
        </div>
    );
};


export default DateOrWeekNavigator;


DateOrWeekNavigator.propTypes = {
    isWeek: PropTypes.bool,
    weekStart: PropTypes.number
};
