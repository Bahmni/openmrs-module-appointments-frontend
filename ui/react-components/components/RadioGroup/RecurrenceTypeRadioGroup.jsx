import React from "react";
import PropTypes from "prop-types";
import Label from '../Label/Label.jsx';
import InputNumber from "../InputNumber/InputNumber.jsx";
import {injectIntl} from "react-intl";

const RecurrenceTypeRadioGroup = props => {
    const {onChange, onFrequencyChange, frequency} = props;
    const groupName = "recurrenceType";
    return (<div>
        <InputNumber onInputChange={onFrequencyChange} defaultValue={frequency}/>
        <input
            type="radio"
            value="Day"
            name={groupName}
            onChange={onChange}
        />
        <Label translationKey="DAY_LABEL" defaultValue="Day"/>
        <input
            type="radio"
            value="week"
            name={groupName}
            onChange={onChange}
        />
        <Label translationKey="WEEK_LABEL" defaultValue="Week"/>
    </div>)
};

RecurrenceTypeRadioGroup.propTypes = {
    intl: PropTypes.object.isRequired,
    frequency: PropTypes.number,
    onChange: PropTypes.func,
    onFrequencyChange: PropTypes.func
};

export default injectIntl(RecurrenceTypeRadioGroup);
