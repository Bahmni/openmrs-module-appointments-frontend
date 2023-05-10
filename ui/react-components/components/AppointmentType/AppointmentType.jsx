import React from "react";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import {TELECONSULTATION_APPOINTMENT} from "../../constants";
import { Checkbox } from 'carbon-components-react';
import 'carbon-components/css/carbon-components.min.css';



const AppointmentType = props => {

    const {onChange, appointmentType, isTeleconsultation, isTeleconsultationDisabled } = props;

    const isVirtual = () => {
        return appointmentType === "Virtual" || isTeleconsultation;
    }

    return (
        <div data-test-id="add-tele-consultation">
            <Checkbox
                defaultChecked={false}
                id="teleconsultation-checkbox"
                onChange={onChange}
                // checked={isVirtual()}
                labelText={TELECONSULTATION_APPOINTMENT}
                disabled={isTeleconsultationDisabled}
            />
    </div>)
};

AppointmentType.propTypes = {
    onChange: PropTypes.func,
    appointmentType: PropTypes.string,
    isTeleconsultation: PropTypes.bool,
    isTeleconsultationDisabled: PropTypes.bool
};

export default injectIntl(AppointmentType);