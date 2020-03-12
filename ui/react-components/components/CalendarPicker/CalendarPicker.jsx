import React, {useState, useRef} from 'react';
import AppointmentDatePicker from "../DatePicker/DatePicker.jsx";
import useOutsideClick from "../../utils/hooks/useOutsideClick";
import PropTypes from "prop-types";
import {
    calendarPickerContainer
} from './CalendarPicker.module.scss'
import {
    disable
} from '../DatePicker/DatePicker.module.scss';
import classNames from "classnames";


const CalendarPicker = (props) => {

    const {date, onChange, minDate, isDisabled} = props;
    const [showDatePicker, setShowDatePicker] = useState(false);
    let styles = [calendarPickerContainer];
    const ref = useRef();

    useOutsideClick(ref, (event) => {
        if(event.target.className.indexOf("react-datepicker")< 0)
            setShowDatePicker(false);
    });

    const handleOnClick = () => {
        !isDisabled && setShowDatePicker(!showDatePicker)
    };


    const handleKeyDown = (e) => {
        if(e.key === 'Escape')
            setShowDatePicker(false);
    };

    return (
        <div data-testid='calendar-picker' className={classNames(styles, isDisabled ? disable : '')} ref={ref} onKeyDown={handleKeyDown}>
            <button data-testid="calendar-icon" onClick={handleOnClick}>
                <i className={classNames("fa", "fa-calendar")} aria-hidden="true"></i>
            </button>
            {showDatePicker && <AppointmentDatePicker
                isDisabled={isDisabled}
                minDate={minDate}
                value={date}
                onChange={onChange}
                handleDateSelection={() => setShowDatePicker(false)}
            />}
        </div>
    );
};

CalendarPicker.propTypes = {
    date: PropTypes.instanceOf(Date),
    onChange: PropTypes.func,
    isDisabled: PropTypes.bool,
    minDate: PropTypes.instanceOf(Date)
};

export default CalendarPicker;


