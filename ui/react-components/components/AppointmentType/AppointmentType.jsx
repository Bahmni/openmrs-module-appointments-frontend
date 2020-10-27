import React from "react";
import Label from "../Label/Label.jsx";
import {checkbox, checkboxContainer, container, appointmentTypeLabel} from "./AppointmentType.module.scss";
import classNames from "classnames";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import {TELECONSULTATION_APPOINTMENT} from "../../constants";

const AppointmentType = props => {

    const {onChange, teleconsultation, isTeleconsultationDisabled } = props;

    return (<div className={classNames(container)}>
        <span className={classNames(appointmentTypeLabel)}><Label className={classNames(appointmentTypeLabel)} translationKey="APPOINTMENT_TYPE_LABEL"
        defaultValue="Appointment Type"/></span>
        <div className={classNames(checkboxContainer)} data-test-id="add-tele-consultation">    
            <Checkbox
                defaultChecked={false}
                className={classNames(checkbox)}
                id="teleconsultation-checkbox"
                onChange={onChange}
                checked={teleconsultation}
                name={TELECONSULTATION_APPOINTMENT}
                disabled={isTeleconsultationDisabled}
            />
            <Label forInput="teleconsultation-checkbox" translationKey="TELECONSULTATION_APPOINTMENT_LABEL"
                defaultValue="Teleconsultation"
                disabled={isTeleconsultationDisabled}/>
        </div>
    </div>)
};

AppointmentType.propTypes = {
    onChange: PropTypes.func,
    appointmentType: PropTypes.string,
    isTeleconsultationDisabled: PropTypes.bool
};

export default injectIntl(AppointmentType);