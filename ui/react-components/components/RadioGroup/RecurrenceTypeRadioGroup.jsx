import React from "react";
import PropTypes from "prop-types";
import Label from '../Label/Label.jsx';
import InputNumber from "../InputNumber/InputNumber.jsx";
import {injectIntl} from "react-intl";
import classNames from 'classnames';
import {
    recurrenceType,
    recurrenceTypeDiv
} from "./RecurrenceTypeRadioGroup.module.scss"

const RecurrenceTypeRadioGroup = props => {
    const {onChange, onFrequencyChange, frequency} = props;
    const groupName = "recurrenceType";
    return (<div className={classNames(recurrenceType)}>
        <div className={classNames(recurrenceTypeDiv)}>
            <InputNumber onInputChange={onFrequencyChange} defaultValue={frequency}/>
        </div>
        <div className={classNames(recurrenceTypeDiv)}>
            <input
                type="radio"
                value="Day"
                name={groupName}
                onChange={onChange}
            />
            <Label translationKey="DAY_LABEL" defaultValue="Day"/>
        </div>
        <div className={classNames(recurrenceTypeDiv)}>
            <input
                type="radio"
                value="week"
                name={groupName}
                onChange={onChange}
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
