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
    saveModalTitle,
    saveModalWarning
} from "./SuccessModal.module.scss";
import PropTypes from "prop-types";
import {AppContext} from "../AppContext/AppContext";
import useFocusLock from "../../utils/hooks/useFocusLock.jsx";

const SuccessModal = (props) => {

    const {intl, patientDetails, resetAppointmentModal, showEmailWarning, showEmailNotSentWarning} = props;

    const {onBack} = React.useContext(AppContext);

    const defaultSaveSuccessMessage = 'The new appointment for the patient {patientDetails} has been saved.';

    const saveSucessHelpText = ()=>{
        return(<div className={classNames(saveModalBody)} >
            <FormattedMessage id={'APPOINTMENT_SAVE_SUCCESS_HELP_TEXT'}
            defaultMessage={'Please check Appointment calendar for the updated schedule'}/> 
        </div>)
    }
    
    const emailWarningHelpText = ()=>{
      return ( <div className={classNames(saveModalWarning)} >
           <FormattedMessage id={'EMAIL_WARNING'}
           defaultMessage={'Warning: No Email ID present for patient to share Teleconsultation communication'}/>
        </div>)
    }

    const emailNotSentWarningHelpText = () => {
        return (<div className={classNames(saveModalWarning)} >
        <FormattedMessage id={'EMAIL_NOT_SENT_WARNING'}
        defaultMessage={'Warning: Unable to share teleconsultation communication, Please contact your support team.'}/>
     </div>)
    }

    return (
        <div className={classNames(saveModal)}>
            <div className={classNames(saveModalCloseIcon)}>
                <button data-testid="save-close-icon" tabIndex={3} onClick={() => onBack()}>
                    <i className={classNames("fa", "fa-times")} />
                </button>
            </div>
            <div>
                <h1 className={classNames(saveModalTitle)}>
                    <FormattedMessage id={'APPOINTMENT_SAVE_SUCCESS_TITLE'} defaultMessage={'Save successful'}/>
                </h1>

                <div className={classNames(saveModalBody)}>
                    <span>
                        <FormattedMessage id={'APPOINTMENT_SAVE_SUCCESS_TEXT'}
                                          defaultMessage={defaultSaveSuccessMessage}
                                          values={{patientDetails: <strong>{patientDetails}</strong>}}/>
                    </span>
                    <br/><br/>
                   {showEmailNotSentWarning === true ? emailNotSentWarningHelpText() : showEmailWarning === true ? emailWarningHelpText() : saveSucessHelpText() }
                </div>

                <div className={classNames(saveConfirmationFooter)}>
                    <button className={classNames(button)} data-testid="save-close-button" onClick={() => onBack()}
                            tabIndex={1}>
                        <FormattedMessage id={'APPOINTMENT_SAVE_SUCCESS_CLOSE'} defaultMessage={'Close'}/>
                    </button>

                    <span className={classNames(newAppointmentLink)}>
                            <button data-testid="save-new-appointment-link" onClick={resetAppointmentModal}
                                    tabIndex={2}>
                                <FormattedMessage id={'ADD_NEW_APPOINTMENT'} defaultMessage={'Add New Appointment'}/>
                            </button>
                        </span>
                </div>
            </div>
        </div>
    );
};

SuccessModal.propTypes = {
    patientDetails: PropTypes.string.isRequired,
    resetAppointmentModal: PropTypes.func.isRequired
};

export default injectIntl(useFocusLock(SuccessModal));
