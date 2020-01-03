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
import useFocusLock from "../FocusLock/useFocusLock.jsx";


const UpdateConfirmationModal = (props) => {

    const {intl, close, save, updateSeries} = props;

    return (
        <div className={classNames(updateConfirmationModal)}>
            <div className={classNames(updateConfirmationModalCloseIcon)}>
                <button data-testid="update-confirmation-close-icon" tabIndex={3} onClick={() => {
                    close();
                }}>
                    <i className={classNames("fa", "fa-times")} />
                </button>
            </div>
            <div>
                <h1 className={classNames(updateConfirmationModalTitle)}>
                    <FormattedMessage id={'APPOINTMENT_UPDATE_CONFIRMATION_TITLE'}
                                      defaultMessage={'Kindly Confirm'}/>
                </h1>
                <div className={classNames(updateConfirmationModalBody)}>
                    {updateSeries ?
                        <FormattedMessage id={'APPOINTMENT_UPDATE_CONFIRMATION_TEXT_RECURRING_APPOINTMENT'}
                                          defaultMessage={'This will update the details of the entire appointment series. This cannot be reversed!'}/> :
                        <FormattedMessage id={'APPOINTMENT_UPDATE_CONFIRMATION_TEXT_SINGLE_APPOINTMENT'}
                                          defaultMessage={'This will update the details of the selected appointment. This cannot be reversed!'}/>
                    }
                </div>
                <div>
                    <button className={classNames(button, no)} data-testid="cancel-update-button" onClick={() => {
                        close();
                    }} tabIndex={1}>
                        <FormattedMessage id={'APPOINTMENT_UPDATE_CONFIRMATION_NO'} defaultMessage={'No, go back'}/>
                    </button>
                    <button className={classNames(button)} data-testid="update-confirm-button" onClick={save}
                            tabIndex={2}>
                        <FormattedMessage id={'APPOINTMENT_UPDATE_CONFIRMATION_YES'}
                                          defaultMessage={'Yes, I confirm'}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

UpdateConfirmationModal.propTypes = {
    close: PropTypes.func,
    save: PropTypes.func,
    updateSeries: PropTypes.bool
};


export default injectIntl(useFocusLock(UpdateConfirmationModal));
