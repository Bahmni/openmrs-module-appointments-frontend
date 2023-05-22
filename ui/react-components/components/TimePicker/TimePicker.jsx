import React, {useEffect, useState} from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {SelectItem, TimePicker, TimePickerSelect} from "carbon-components-react";
import moment from "moment";

const AppointmentTimePicker = (props) => {
    const { intl, onChange, defaultTime, translationKey, defaultTranslationKey, width } = props;
    const key = intl.formatMessage({
        id: translationKey, defaultMessage: defaultTranslationKey
    });
    let timeStamp = []; // = ["12:00", "AM"];
    if(defaultTime){
        timeStamp = moment(defaultTime).format("h:mm A").split(" ");
    }
    const [time, setTime] = useState(timeStamp[0]);
    const [period, setPeriod] = useState(timeStamp[1]);
    useEffect(()=>{
        setTime(timeStamp[0]);
        setPeriod(timeStamp[1])
    }, [defaultTime])
    const handleChange = e => {
        const selectedTime = moment(e.target.value + period, "h:mm A")
        setTime(e.target.value)
        onChange(selectedTime)
    }
    const handlePeriod = e => {
        const selectedTime = moment(time + e.target.value + period, "h:mm A")
        setPeriod(e.target.value)
        onChange(selectedTime)
    }

    return (
    <TimePicker id="time-selector" labelText={key} onBlur={handleChange} value={time}
                style={{ width: "72px", padding: "0 0 0 1rem"}} autoComplete={"off"}>
             <TimePickerSelect id="time-picker-select-1" labelText={"Choose a time"} onChange={handlePeriod} value={period}>
               <SelectItem value="AM" text="AM" />
               <SelectItem value="PM" text="PM" />
             </TimePickerSelect>
            </TimePicker>
    );
};

AppointmentTimePicker.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultTranslationKey: PropTypes.string,
    translationKey: PropTypes.string,
    defaultTime: PropTypes.object,
    isDisabled: PropTypes.bool,
    width: PropTypes.string
};

export default injectIntl(AppointmentTimePicker);
