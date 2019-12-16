import React, {useEffect, useState} from 'react';
import Calendar from 'rc-calendar';
import 'rc-calendar/assets/index.css';
import {
    appointmentDatePicker,
    appointmentDatePickerNotSelected,
    appointmentDatePickerSelected,
    disable
} from './DatePicker.module.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {getLocale} from "../../utils/LocalStorageUtil.js";
import moment from 'moment';

const AppointmentDatePicker = (props) => {
    const {minDate, value, onClear, onChange, isDisabled} = props;
    let styles = [appointmentDatePicker];
    value ? styles.push(appointmentDatePickerSelected)
        : styles.push(appointmentDatePickerNotSelected);

    return (
        <div data-testid="datePicker" className={classNames(isDisabled ? disable : '')}>
            <Calendar
                showOk={false}
                showToday={false}
                onClear={onClear}
                disabledDate={date => minDate ? date.isBefore(minDate) : date}
                className={classNames(styles)}
                dateInputPlaceholder="mm/dd/yyyy"
                onSelect={onChange}
                selectedValue={value}
                defaultValue={moment().locale(getLocale())}
            />
        </div>
    );
};

AppointmentDatePicker.propTypes = {
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    defaultValue: PropTypes.object,
    minDate: PropTypes.object,
    isDisabled: PropTypes.bool
};

export default AppointmentDatePicker;
