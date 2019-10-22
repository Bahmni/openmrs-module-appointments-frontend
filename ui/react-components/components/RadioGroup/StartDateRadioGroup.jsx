import React, {useState} from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import Label from '../Label/Label.jsx';
import {radioButton, grayOut} from './RadioGroup.module.scss';
import moment from 'moment';
import {injectIntl} from "react-intl";

const StartDateRadioGroup = props => {
    const {onChange, startDateType} = props;
    const groupName = "startDateType";
    const date = moment().format("Do MMMM YYYY");
    return (<div>
        <div className={(!startDateType || startDateType === "Today")
            ? classNames(radioButton) : classNames(grayOut)}>
            <input
                type="radio"
                value="Today"
                name={groupName}
                onChange={onChange}
                checked={startDateType === "Today"}
            />
            <Label translationKey="TODAY_LABEL" defaultValue="Today"/>&nbsp;|
            &nbsp;{date}
        </div>
        <div className={(!startDateType || startDateType === "From")
            ? classNames(radioButton) : classNames(grayOut)}>
            <input
                type="radio"
                value="From"
                name={groupName}
                onChange={onChange}
                checked={startDateType === "From"}
            />
            <Label translationKey="FROM_LABEL" defaultValue="From"/>
        </div>
    </div>)
};

StartDateRadioGroup.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    startDateType: PropTypes.string
};

export default injectIntl(StartDateRadioGroup);
