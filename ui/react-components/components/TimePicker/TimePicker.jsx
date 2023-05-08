import React from 'react';
import 'rc-time-picker/assets/index.css';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {SelectItem, TimePicker, TimePickerSelect} from "carbon-components-react";
import 'carbon-components/css/carbon-components.min.css';
import classNames from 'classnames';

const AppointmentTimePicker = (props) => {
    const { intl, placeHolderTranslationKey, placeHolderDefaultMessage, onChange, defaultTime, isDisabled } = props;

    const placeholder = intl.formatMessage({
        id: placeHolderTranslationKey, defaultMessage: placeHolderDefaultMessage
    });
    return (
        // <TimePicker id="time-selector"
        //     value={defaultTime}
        //     onChange={onChange}
        //     showSecond={false}
        //     use12Hours
        //     placeholder={placeholder}
        //     className={classNames(appointmentTimePicker)}
        //     popupClassName={classNames(appointmentTimePickerPopup)}
        //     disabled={isDisabled}
        //     focusOnOpen={true} />
    <TimePicker id="time-selector" labelText={placeholder}>
             <TimePickerSelect id="time-picker-select-1" labelText={"Choose a time"}>
               <SelectItem value="AM" text="AM" />
               <SelectItem value="PM" text="PM" />
             </TimePickerSelect>
            </TimePicker>
    );
};

AppointmentTimePicker.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    placeHolderTranslationKey: PropTypes.string.isRequired,
    placeHolderDefaultMessage: PropTypes.string.isRequired,
    defaultTime: PropTypes.object,
    isDisabled: PropTypes.bool
};

export default injectIntl(AppointmentTimePicker);
