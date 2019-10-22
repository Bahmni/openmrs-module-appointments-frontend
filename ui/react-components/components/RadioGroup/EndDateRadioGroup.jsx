import React, {useState} from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import Label from '../Label/Label.jsx';
import {grayOut, radioButton} from './RadioGroup.module.scss';
import InputNumber from "../InputNumber/InputNumber.jsx";
import {injectIntl} from "react-intl";

const EndDateRadioGroup = props => {
    const {onChange, onOccurencesChange, occurences} = props;
    const groupName = "endDateType";
    const [currentSelection, setCurrentSelection] = useState();
    const handleChange = event => {
        setCurrentSelection(event.currentTarget.value);
        onChange(event);
    };
    return (<div>
        <div
            className={(!currentSelection || currentSelection === "After")
                ? classNames(radioButton) : classNames(grayOut)}>
            <input
                type="radio"
                value="After"
                name={groupName}
                onChange={handleChange}
            />
            <Label translationKey="AFTER_LABEL" defaultValue="After"/>
            <InputNumber onInputChange={onOccurencesChange} defaultValue={occurences}/>
            <Label translationKey="OCCURENCES_LABEL" defaultValue="Occurences"/>
        </div>
        <div
            className={(!currentSelection || currentSelection === "On")
                ? classNames(radioButton) : classNames(grayOut)}>
            <input
                type="radio"
                value="On"
                name={groupName}
                onChange={handleChange}
            />
            <Label translationKey="ON_LABEL" defaultValue="On"/>
        </div>
    </div>)
};

EndDateRadioGroup.propTypes = {
    intl: PropTypes.object.isRequired,
    occurences: PropTypes.number,
    onChange: PropTypes.func,
    onOccurencesChange: PropTypes.func
};

export default injectIntl(EndDateRadioGroup);
