import React from "react";
import Label from "../Label/Label.jsx";
import {checkbox, checkboxContainer, planLabel} from "./RecurringPlan.module.scss";
import classNames from "classnames";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';

const RecurringPlan = props => {
    return (<div>
        <span className={classNames(planLabel)}><Label className={classNames(planLabel)} translationKey="PLAN_LABEL" defaultValue="Plan"/></span>
        <div className={classNames(checkboxContainer)} data-test-id="checkbox">
            <Checkbox
            onChange={props.onChange}
            defaultChecked={false}
            className={classNames(checkbox)}
        />
            <Label translationKey="RECURRING_APPOINTMENT_LABEL" defaultValue="Recurring Appointment"/>
        </div>
    </div>)
};

RecurringPlan.propTypes = {
    onChange: PropTypes.func.isRequired
};

export default injectIntl(RecurringPlan);