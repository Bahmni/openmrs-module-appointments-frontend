import React from "react";
import classNames from "classnames";
import {FormattedMessage, injectIntl} from "react-intl";
import {
    button,
    no,
    updateConfirmationModal,
    updateConfirmationModalBody,
    updateConfirmationModalCloseIcon,
    updateConfirmationModalTitle
} from "./UpdateConfirmationModal.module.scss";
import PropTypes from "prop-types";

const UpdateConfirmationModal = (props) => {

    const {intl, close, save, isRecurring} = props;

    return (
        <div className={classNames(updateConfirmationModal)}>
            <div className={classNames(updateConfirmationModalCloseIcon)}>
                <a data-testid="update-confirmation-close-icon">
                    <i className={classNames("fa", "fa-times")} onClick={() => {close();}}/>
                </a>
            </div>
            <div>
                <h1 className={classNames(updateConfirmationModalTitle)}>
                    <FormattedMessage id={'APPOINTMENT_UPDATE_CONFIRMATION_TITLE'} defaultMessage={'Kindly Confirm'}/>
                </h1>
                <div className={classNames(updateConfirmationModalBody)}>
                    <FormattedMessage id={'APPOINTMENT_UPDATE_CONFIRMATION_TEXT_RECURRING_APPT'}
                                      defaultMessage={'This will update the new details on the entire scheduled series. This can not be reversed'}/>
                </div>
                <div>
                    <button className={classNames(button, no)} data-testid="cancel-update-button" onClick={() => {close();}}>
                        <FormattedMessage id={'APPOINTMENT_UPDATE_CONFIRMATION_NO'} defaultMessage={'No, go back'}/>
                    </button>
                    <button className={classNames(button)} data-testid="update-confirm-button" onClick={save}>
                        <FormattedMessage id={'APPOINTMENT_UPDATE_CONFIRMATION_YES'} defaultMessage={'Yes, I confirm'}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

UpdateConfirmationModal.propTypes = {
    close: PropTypes.func,
    save: PropTypes.func,
    isRecurring: PropTypes.bool
};


export default injectIntl(UpdateConfirmationModal);
