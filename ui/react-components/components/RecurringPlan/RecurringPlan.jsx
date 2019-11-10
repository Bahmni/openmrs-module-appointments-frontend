import React from "react";
import Label from "../Label/Label.jsx";
import {checkbox, checkboxContainer, planLabel, container} from "./RecurringPlan.module.scss";
import classNames from "classnames";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';

const RecurringPlan = props => {

    const {onChange, isRecurring, isEdit} = props;

    return (<div className={classNames(container)}>
        <span className={classNames(planLabel)}><Label className={classNames(planLabel)} translationKey="PLAN_LABEL"
                                                       defaultValue="Plan"/></span>
        <div className={classNames(checkboxContainer)} data-test-id="checkbox">
            <Checkbox
                onChange={onChange}
                defaultChecked={false}
                className={classNames(checkbox)}
                id="recurrence-selection-checkbox"
                checked={isRecurring}
                disabled={isEdit}
            />
            <Label forInput="recurrence-selection-checkbox" translationKey="RECURRING_APPOINTMENT_LABEL"
                   defaultValue="Recurring Appointment" disabled={isEdit}/>
        </div>
    </div>)
};

RecurringPlan.propTypes = {
    onChange: PropTypes.func,
    isRecurring: PropTypes.bool,
    isEdit: PropTypes.bool
};

export default injectIntl(RecurringPlan);
