import React, {useState} from "react";
import PropTypes from "prop-types";
import Label from '../Label/Label.jsx';
import InputNumber from "../InputNumber/InputNumber.jsx";
import {injectIntl} from "react-intl";
import classNames from 'classnames';
import {
    recurrenceType,
    recurrenceTypeDiv,
    grayOut
} from "./RecurrenceTypeRadioGroup.module.scss"

const RecurrenceTypeRadioGroup = props => {
    const {onChange, onFrequencyChange, frequency} = props;
    const groupName = "recurrenceType";
    const [currentSelection, setCurrentSelection] = useState();
    const handleChange = event => {
        setCurrentSelection(event.currentTarget.value);
        onChange(event);
    };
    return (<div className={classNames(recurrenceType)}>
        <div className={classNames(recurrenceTypeDiv)}>
            <InputNumber onInputChange={onFrequencyChange} defaultValue={frequency}/>
        </div>
        <div
            className={(!currentSelection || currentSelection === "Day")
                ? classNames(recurrenceTypeDiv) : classNames(grayOut)}>
            <input
                type="radio"
                value="Day"
                name={groupName}
                onChange={handleChange}
            />
            <Label translationKey="DAY_LABEL" defaultValue="Day"/>
        </div>
        <div
            className={(!currentSelection || currentSelection === "Week")
                ? classNames(recurrenceTypeDiv) : classNames(grayOut)}>
            <input
                type="radio"
                value="Week"
                name={groupName}
                onChange={handleChange}
            />
            <Label translationKey="WEEK_LABEL" defaultValue="Week"/>
        </div>

    </div>)
};

RecurrenceTypeRadioGroup.propTypes = {
    intl: PropTypes.object.isRequired,
    frequency: PropTypes.number,
    onChange: PropTypes.func,
    onFrequencyChange: PropTypes.func
};

export default injectIntl(RecurrenceTypeRadioGroup);
