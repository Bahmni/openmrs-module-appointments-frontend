import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import Label from '../Label/Label.jsx';
import {radioButton} from './RadioGroup.module.scss';
import InputNumber from "../InputNumber/InputNumber.jsx";
import {injectIntl} from "react-intl";

const EndDateRadioGroup = props => {
    const {onChange, onOccurencesChange, occurences} = props;
    const groupName = "endDateType";
    return (<div>
        <div className={classNames(radioButton)}>
            <input
                type="radio"
                value="After"
                name={groupName}
                onChange={onChange}
            />
            <Label translationKey="AFTER_LABEL" defaultValue="After"/>
            <InputNumber onInputChange={onOccurencesChange} defaultValue={occurences}/>
            <Label translationKey="OCCURENCES_LABEL" defaultValue="Occurences"/>
        </div>
        <div className={classNames(radioButton)}>
            <input
                type="radio"
                value="On"
                name={groupName}
                onChange={onChange}
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
