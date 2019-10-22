import React, {useState} from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import Label from '../Label/Label.jsx';
import {radioButton, grayOut} from './RadioGroup.module.scss';
import moment from 'moment';
import {injectIntl} from "react-intl";

const StartDateRadioGroup = props => {
    const {onChange} = props;
    const groupName = "startDateType";
    const date = moment().format("Do MMMM YYYY");
    const [currentSelection, setCurrentSelection] = useState();
    const handleChange = event => {
        setCurrentSelection(event.currentTarget.value);
        onChange(event);
    };
    return (<div>
        <div className={(!currentSelection || currentSelection === "Today")
            ? classNames(radioButton) : classNames(grayOut)}>
            <input
                type="radio"
                value="Today"
                name={groupName}
                onChange={handleChange}
            />
            <Label translationKey="TODAY_LABEL" defaultValue="Today"/>&nbsp;|
            &nbsp;{date}
        </div>
        <div className={(!currentSelection || currentSelection === "From")
            ? classNames(radioButton) : classNames(grayOut)}>
            <input
                type="radio"
                value="From"
                name={groupName}
                onChange={handleChange}
            />
            <Label translationKey="FROM_LABEL" defaultValue="From"/>
        </div>
    </div>)
};

StartDateRadioGroup.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func
};

export default injectIntl(StartDateRadioGroup);
