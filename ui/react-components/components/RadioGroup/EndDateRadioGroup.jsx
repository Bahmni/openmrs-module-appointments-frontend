import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import Label from '../Label/Label.jsx';
import {grayOut, radioButton} from './RadioGroup.module.scss';
import InputNumber from "../InputNumber/InputNumber.jsx";
import {injectIntl} from "react-intl";

const EndDateRadioGroup = props => {
    const {onChange, onOccurrencesChange, occurrences, endDateType} = props;
    const groupName = "endDateType";
    const disableInput = () => {
        return endDateType === "On"
    };
    return (<div>
        <div className={classNames(radioButton)}>
            <input
                data-testid="after-radio-button"
                id="after"
                type="radio"
                value="After"
                name={groupName}
                onChange={onChange}
                checked={endDateType === "After"}
            />

            <Label translationKey="AFTER_LABEL" defaultValue="After" forInput="after"/>
            <div disabled={disableInput()} data-testid="occurrences">
                <InputNumber onChange={onOccurrencesChange} defaultValue={occurrences}/>
                <Label translationKey="OCCURRENCES_LABEL" defaultValue="Occurrences"/>
            </div>
        </div>
        <div className={(!endDateType || endDateType === "On")
            ? classNames(radioButton) : classNames(grayOut)}>
            <input
                data-testid="on-radio-button"
                id="on"
                type="radio"
                value="On"
                name={groupName}
                onChange={onChange}
                checked={endDateType === "On"}
            />
            <Label translationKey="ON_LABEL" defaultValue="On" forInput="on"/>
        </div>
    </div>)
};

EndDateRadioGroup.propTypes = {
    intl: PropTypes.object.isRequired,
    occurrences: PropTypes.number,
    onChange: PropTypes.func,
    onOccurrencesChange: PropTypes.func,
    endDateType: PropTypes.string
};

export default injectIntl(EndDateRadioGroup);
