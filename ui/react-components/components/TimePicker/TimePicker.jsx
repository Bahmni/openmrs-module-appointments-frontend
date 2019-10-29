import React from 'react';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import { appointmentTimePicker } from './TimePicker.module.scss';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const AppointmentTimePicker = (props) => {
    const { intl, placeHolderTranslationKey, placeHolderDefaultMessage, onChange, defaultTime } = props;

    const placeholder = intl.formatMessage({
        id: placeHolderTranslationKey, defaultMessage: placeHolderDefaultMessage
    });

    return (
        <TimePicker data-testid="time-selector"
            value={defaultTime}
            onChange={onChange}
            showSecond={false}
            use12Hours
            placeholder={placeholder}
            className={classNames(appointmentTimePicker)} />
    );
};

AppointmentTimePicker.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    placeHolderTranslationKey: PropTypes.string.isRequired,
    placeHolderDefaultMessage: PropTypes.string.isRequired,
    defaultTime: PropTypes.object
};

export default injectIntl(AppointmentTimePicker);
