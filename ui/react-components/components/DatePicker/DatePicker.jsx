import React, { Text } from 'react';
import Calendar from 'rc-calendar';
import 'rc-calendar/assets/index.css';
import { appointmentDatePicker } from './DatePicker.module.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

const AppointmentDatePicker = (props) => {

    const disablePastDates = (current) => {
        if (!current) {
            return false;
        }
        const date = moment().subtract('1','days').endOf('day');
        return current.isBefore(date);
    };

    return (
        <div data-testid="datePicker">
            <Calendar
                showToday={false}
                showOk={false}
                onChange={props.onChange}
                disabledDate={disablePastDates}
                className={classNames(appointmentDatePicker)}
                onClear={props.onClear}
                dateInputPlaceholder="mm/dd/yyyy"
            />
        </div>
    );
};

AppointmentDatePicker.propTypes = {
    onChange: PropTypes.func
};

export default AppointmentDatePicker;
