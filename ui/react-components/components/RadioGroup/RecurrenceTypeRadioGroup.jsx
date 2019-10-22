import React, {useState} from "react";
import PropTypes from "prop-types";
import Label from '../Label/Label.jsx';
import InputNumber from "../InputNumber/InputNumber.jsx";
import {injectIntl} from "react-intl";
import classNames from 'classnames';
import {
    recurrenceTypeContainer,
    recurrenceTypeDiv,
    grayOut
} from "./RecurrenceTypeRadioGroup.module.scss"

const RecurrenceTypeRadioGroup = props => {
    const {onChange, onFrequencyChange, frequency, recurrenceType} = props;
    const groupName = "recurrenceType";

    return (<div className={classNames(recurrenceTypeContainer)}>
        <div className={classNames(recurrenceTypeDiv)}>
            <InputNumber onInputChange={onFrequencyChange} defaultValue={frequency}/>
        </div>
        <div
            className={(!recurrenceType || recurrenceType === "Day")
                ? classNames(recurrenceTypeDiv) : classNames(grayOut)}>
            <input
                type="radio"
                value="Day"
                name={groupName}
                onChange={onChange}
                checked={recurrenceType === "Day"}
            />
            <Label translationKey="DAY_LABEL" defaultValue="Day"/>
        </div>
        <div
            className={(!recurrenceType || recurrenceType === "Week")
                ? classNames(recurrenceTypeDiv) : classNames(grayOut)}>
            <input
                type="radio"
                value="Week"
                name={groupName}
                onChange={onChange}
                checked={recurrenceType === "Week"}
            />
            <Label translationKey="WEEK_LABEL" defaultValue="Week"/>
        </div>

    </div>)
};

RecurrenceTypeRadioGroup.propTypes = {
    intl: PropTypes.object.isRequired,
    frequency: PropTypes.number,
    onChange: PropTypes.func,
    onFrequencyChange: PropTypes.func,
    recurrenceType: PropTypes.string,
};

export default injectIntl(RecurrenceTypeRadioGroup);
