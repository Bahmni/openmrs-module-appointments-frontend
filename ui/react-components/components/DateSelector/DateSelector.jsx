import React from 'react';
import PropTypes from 'prop-types';
import Label from "../Label/Label.jsx";
import AppointmentDatePicker from "../DatePicker/DatePicker.jsx";
import {injectIntl} from "react-intl";
import classNames from 'classnames';
import {appointmentDatePicker} from './DateSelector.module.scss'

const DateSelector = props => {
    const {translationKey, defaultValue, onChange, onClear} = props;

    return (
        <div>
            <Label translationKey={translationKey} defaultValue={defaultValue}/>
            <div className={classNames(appointmentDatePicker)}>
                <AppointmentDatePicker onChange={onChange} onClear={onClear}/>
            </div>
        </div>
    )
};


DateSelector.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultValue: PropTypes.string.isRequired,
    translationKey: PropTypes.string
};

export default injectIntl(DateSelector);
