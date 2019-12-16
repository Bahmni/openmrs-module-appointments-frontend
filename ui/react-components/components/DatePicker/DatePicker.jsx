import React from 'react';
import 'rc-calendar/assets/index.css';
import {
    appointmentDatePicker,
    appointmentDatePickerNotSelected,
    appointmentDatePickerSelected,
    disable,
    disabledDate
} from './DatePicker.module.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AppointmentDatePicker = (props) => {
    const {minDate, value, onClear, onChange, isDisabled} = props;
    // let styles = [appointmentDatePicker];
    // value ? styles.push(appointmentDatePickerSelected)
    //     : styles.push(appointmentDatePickerNotSelected);
    let calendarStyles =[];
    isDisabled && calendarStyles.push(disable);
    console.log('min date', minDate)
    return (
        <div data-testid="datePicker" className={classNames(isDisabled ? disable : '')}>
            <DatePicker
                selected={value}
                onChange={onChange}
                inline
                readOnly={isDisabled}
                dayClassName={() => isDisabled ? classNames(disabledDate) : ''}
                calendarClassName={calendarStyles}
                minDate={minDate}
            />
        </div>
    );
};

AppointmentDatePicker.propTypes = {
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    value: PropTypes.object.isRequired,
    minDate: PropTypes.object,
    isDisabled: PropTypes.bool
};

export default AppointmentDatePicker;
