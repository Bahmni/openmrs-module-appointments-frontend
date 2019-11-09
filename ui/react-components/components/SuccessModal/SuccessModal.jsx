import React from "react";
import classNames from "classnames";
import {FormattedMessage, injectIntl} from "react-intl";
import {
    button,
    newAppointmentLink,
    saveConfirmationFooter,
    saveModal,
    saveModalBody,
    saveModalCloseIcon,
    saveModalTitle
} from "./SuccessModal.module.scss";
import PropTypes from "prop-types";
import {AppContext} from "../AppContext/AppContext";

const SuccessModal = (props) => {

    const {intl, patientDetails} = props;
    const {onBack, angularState} = React.useContext(AppContext);

    const saveConfirmationTextPartOne = intl.formatMessage({
        id: 'APPOINTMENT_SAVE_CONFIRMATION_TEXT_PART_1', defaultMessage: 'The new appointment for the patient'
    });

    const saveConfirmationTextPartTwo = intl.formatMessage({
        id: 'APPOINTMENT_SAVE_CONFIRMATION_TEXT_PART_2', defaultMessage: 'has been saved.'
    });

    return (
        <div className={classNames(saveModal)}>
            <div className={classNames(saveModalCloseIcon)}>
                <a data-testid="save-close-icon">
                    <i className={classNames("fa", "fa-times")} onClick={() => onBack(angularState)}/>
                </a>
            </div>
            <div>
                <h1 className={classNames(saveModalTitle)}>
                    <FormattedMessage id={'APPOINTMENT_SAVE_CONFIRMATION_TITLE'} defaultMessage={'Save successful'}/>
                </h1>
                <div className={classNames(saveModalBody)}>
                    <span>{`${saveConfirmationTextPartOne} "${patientDetails}" ${saveConfirmationTextPartTwo}`}</span>
                    <br/><br/>
                    <FormattedMessage id={'APPOINTMENT_SAVE_CONFIRMATION_TEXT_PART_3'}
                                      defaultMessage={'Please check Appointment calendar for the updated schedule'}/>
                </div>
                <div className={classNames(saveConfirmationFooter)}>
                    <button className={classNames(button)} data-testid="save-close-button" onClick={() => onBack(angularState)}>
                        <FormattedMessage id={'APPOINTMENT_SAVE_CONFIRMATION_CLOSE'} defaultMessage={'Close'}/>
                    </button>
                    <span className={classNames(newAppointmentLink)}>
                        <a  data-testid="save-new-appointment-link" onClick={() => window.location.reload()}>
                         <FormattedMessage id={'ADD_NEW_APPOINTMENT'} defaultMessage={'Add New Appointment'}/>
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
};

SuccessModal.propTypes = {
    patientDetails: PropTypes.string.isRequired
};

export default injectIntl(SuccessModal);
