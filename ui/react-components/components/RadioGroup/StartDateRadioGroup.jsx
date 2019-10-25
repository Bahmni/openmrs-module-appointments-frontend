import React, {useState} from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import Label from '../Label/Label.jsx';
import {radioButton, grayOut, dateText} from './RadioGroup.module.scss';
import moment from 'moment';
import {injectIntl} from "react-intl";
import {FROM, TODAY} from "../../constants";

const StartDateRadioGroup = props => {
    const {onChange, startDateType} = props;
    const groupName = "startDateType";
    const date = moment().format("Do MMMM YYYY");
    return (<div>
        <div className={(!startDateType || startDateType === TODAY)
            ? classNames(radioButton) : classNames(grayOut)}>
            <input
                data-testid="today-radio-button"
                id="today"
                type="radio"
                value={TODAY}
                name={groupName}
                onChange={onChange}
                checked={startDateType === TODAY}
            />
            <Label translationKey="TODAY_LABEL" defaultValue="Today" forInput="today"/>
            <span className={classNames(dateText)}>{date}</span>
        </div>
        <div className={(!startDateType || startDateType === FROM)
            ? classNames(radioButton) : classNames(grayOut)}>
            <input
                data-testid="from-radio-button"
                id="from"
                type="radio"
                value={FROM}
                name={groupName}
                onChange={onChange}
                checked={startDateType === FROM}
            />
            <Label translationKey="FROM_LABEL" defaultValue="From" forInput="from"/>
        </div>
    </div>)
};

StartDateRadioGroup.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    startDateType: PropTypes.string
};

export default injectIntl(StartDateRadioGroup);
