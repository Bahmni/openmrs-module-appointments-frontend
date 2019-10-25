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
import {dayRecurrenceType, weekRecurrenceType} from "../../constants";

const RecurrenceTypeRadioGroup = props => {
    const {onChange, onPeriodChange, period, recurrenceType} = props;
    const groupName = "recurrenceType";

    return (<div className={classNames(recurrenceTypeContainer)}>
        <div className={classNames(recurrenceTypeDiv)}>
            <InputNumber onInputChange={onPeriodChange} defaultValue={period} />
        </div>
        <div
            className={(!recurrenceType || recurrenceType === dayRecurrenceType)
                ? classNames(recurrenceTypeDiv) : classNames(grayOut)}>
            <input
                type="radio"
                value={dayRecurrenceType}
                name={groupName}
                onChange={onChange}
                checked={recurrenceType === dayRecurrenceType}
            />
            <Label translationKey="DAY_LABEL" defaultValue="Day"/>
        </div>
        <div
            className={(!recurrenceType || recurrenceType === weekRecurrenceType)
                ? classNames(recurrenceTypeDiv) : classNames(grayOut)}>
            <input
                type="radio"
                value={weekRecurrenceType}
                name={groupName}
                onChange={onChange}
                checked={recurrenceType === weekRecurrenceType}
                disabled={true}
            />
            <Label translationKey="WEEK_LABEL" defaultValue="Week"/>
        </div>
    </div>)
};

RecurrenceTypeRadioGroup.propTypes = {
    intl: PropTypes.object.isRequired,
    period: PropTypes.number,
    onChange: PropTypes.func,
    onPeriodChange: PropTypes.func,
    recurrenceType: PropTypes.string,
};

export default injectIntl(RecurrenceTypeRadioGroup);
