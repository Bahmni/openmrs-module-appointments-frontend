import React, {Text, useState} from 'react';
import Calendar from 'rc-calendar';
import 'rc-calendar/assets/index.css';
import { appointmentDatePicker, appointmentDatePickerSelected, appointmentDatePickerNotSelected } from './DatePicker.module.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

const AppointmentDatePicker = (props) => {
    const [value, setValue] = useState(null);
    const disablePastDates = (current) => {
        if (!current) {
            return false;
        }
        const date = moment().subtract('1', 'days').endOf('day');
        return current.isBefore(date);
    };
    const onChange = (date) => { setValue(date); props.onChange(date); };
    const onClear = () => { setValue(null); props.onClear(); };
    let styles = [appointmentDatePicker];
    value ? styles.push(appointmentDatePickerSelected)
        : styles.push(appointmentDatePickerNotSelected);

    return (
        <div data-testid="datePicker">
            <Calendar
                showOk={false}
                showToday={false}
                onClear={onClear}
                disabledDate={disablePastDates}
                selectedValue={value}
                className={classNames(styles)}
                dateInputPlaceholder="mm/dd/yyyy"
                onSelect={onChange}
            />
        </div>
    );
};

AppointmentDatePicker.propTypes = {
    onChange: PropTypes.func
};

export default AppointmentDatePicker;
