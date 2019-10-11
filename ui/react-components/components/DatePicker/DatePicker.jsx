import React, { Text } from 'react';
import Calendar from 'rc-calendar';
import 'rc-calendar/assets/index.css';
import Label from '../Label/Label.jsx';
import { appointmentDatePicker } from './DatePicker.module.scss';
import PropTypes from 'prop-types';

const AppointmentDatePicker = (props) => {

    const disablePastDates = (current) => {
        if (!current) {
            return false;
        }
        const date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return current.valueOf() < date.valueOf();
    }

    return (
        <div>
            <Label translationKey={props.translationKey} defaultValue={props.defaultValue} />
            <Calendar
                showToday={false}
                showOk={false}
                onChange={props.onChange}
                disabledDate={disablePastDates}
                className={appointmentDatePicker}
            />
        </div>
    );
};

AppointmentDatePicker.propTypes = {
    translationKey: PropTypes.string.isRequired,
    defaultValue: PropTypes.string.isRequired
};

export default AppointmentDatePicker;