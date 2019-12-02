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

    const {intl, patientDetails, isEdit} = props;
    const {onBack} = React.useContext(AppContext);

    const defaultSaveSuccessMessage = 'The new appointment for the patient {patientDetails} has been saved.';

    return (
        <div className={classNames(saveModal)}>
            <div className={classNames(saveModalCloseIcon)}>
                <a data-testid="save-close-icon">
                    <i className={classNames("fa", "fa-times")} onClick={() => onBack()}/>
                </a>
            </div>
            <div>
                <h1 className={classNames(saveModalTitle)}>
                    <FormattedMessage id={'APPOINTMENT_SAVE_SUCCESS_TITLE'} defaultMessage={isEdit ? 'Update Successful!' : 'Save successful'}/>
                </h1>

                <div className={classNames(saveModalBody)}>
                    <FormattedMessage id={'APPOINTMENT_SAVE_SUCCESS_TEXT'} defaultMessage={defaultSaveSuccessMessage} values={{patientDetails}} />
                    <br/><br/>
                    <FormattedMessage id={'APPOINTMENT_SAVE_SUCCESS_HELP_TEXT'}
                                      defaultMessage={'Please check Appointment calendar for the updated schedule'}/>
                </div>

                <div className={classNames(saveConfirmationFooter)}>
                    <button className={classNames(button)} data-testid="save-close-button" onClick={() => onBack()}>
                        <FormattedMessage id={'APPOINTMENT_SAVE_SUCCESS_CLOSE'} defaultMessage={'Close'}/>
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
    patientDetails: PropTypes.string.isRequired,
    isEdit: PropTypes.bool
};

export default injectIntl(SuccessModal);
