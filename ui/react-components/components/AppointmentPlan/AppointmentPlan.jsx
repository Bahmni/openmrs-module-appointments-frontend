import React from "react";
import Label from "../Label/Label.jsx";
import {checkbox, checkboxContainer, container, planLabel} from "./AppointmentPlan.module.scss";
import classNames from "classnames";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import {RECURRING_APPOINTMENT_TYPE, WALK_IN_APPOINTMENT_TYPE} from "../../constants";

const AppointmentPlan = props => {

    const {onChange, appointmentType, isWalkInDisabled, isRecurringDisabled} = props;

    return (<div className={classNames(container)}>
        <span className={classNames(planLabel)}><Label className={classNames(planLabel)} translationKey="PLAN_LABEL"
                                                       defaultValue="Plan"/></span>
        <div className={classNames(checkboxContainer)} data-testid="checkbox">
            <Checkbox
                onChange={onChange}
                defaultChecked={false}
                className={classNames(checkbox)}
                id="recurrence-selection-checkbox"
                checked={appointmentType === RECURRING_APPOINTMENT_TYPE}
                disabled={isRecurringDisabled}
                name={RECURRING_APPOINTMENT_TYPE}
            />
            <Label forInput="recurrence-selection-checkbox" translationKey="RECURRING_APPOINTMENT_LABEL"
                   defaultValue="Recurring Appointment" disabled={isRecurringDisabled}/>
        </div>

        <div className={classNames(checkboxContainer)} data-test-id="walk-in-appointment">
            <Checkbox
                defaultChecked={false}
                className={classNames(checkbox)}
                id="walk-in-selection-checkbox"
                onChange={onChange}
                checked={appointmentType === WALK_IN_APPOINTMENT_TYPE}
                name={WALK_IN_APPOINTMENT_TYPE}
                disabled={isWalkInDisabled}
            />
            <Label forInput="walk-in-selection-checkbox" translationKey="WALK_IN_APPOINTMENT_LABEL"
                   defaultValue="Walk-in Appointment"
                   disabled={isWalkInDisabled}/>
        </div>
    </div>)
};

AppointmentPlan.propTypes = {
    onChange: PropTypes.func,
    appointmentType: PropTypes.string,
    isWalkInDisabled: PropTypes.bool,
    isRecurringDisabled: PropTypes.bool
};

export default injectIntl(AppointmentPlan);
