import React from "react";
import classNames from "classnames";
import {FormattedMessage} from "react-intl";
import {
    cancelModal,
    cancelModalCloseIcon,
    cancelModalTitle,
    cancelModalBody,
    button,
    no
} from "../CancelConfirmation/CancelConfirmation.module.scss";
import PropTypes from "prop-types";

const CancelConfirmation = (props) => {

    const {close, onBack} = props;

    return (
        <div className={classNames(cancelModal)}>
            <div className={classNames(cancelModalCloseIcon)}>
                <a data-testid="cancel-close-icon">
                    <i className={classNames("fa", "fa-times")} onClick={close}/>
                </a>
            </div>
            <div>
                <h1 className={classNames(cancelModalTitle)}>
                    <FormattedMessage id={'APPOINTMENT_CANCEL_CONFIRMATION_TITLE'} defaultMessage={'Wait!'}/>
                </h1>
                <div className={classNames(cancelModalBody)}>
                    <FormattedMessage id={'APPOINTMENT_CANCEL_CONFIRMATION_TEXT'}
                                      defaultMessage={'Are you sure you want to cancel adding the new appointment?This will erase everything you have filled. Nothing will be saved.'}/>
                </div>
                <div>
                    <button className={classNames(button, no)} data-testid="cancel-no" onClick={close} >
                        <FormattedMessage id={'APPOINTMENT_CANCEL_CONFIRMATION_NO'} defaultMessage={'No'}/>
                    </button>
                    <button className={classNames(button)} data-testid="cancel-yes" onClick={onBack}>
                        <FormattedMessage id={'APPOINTMENT_CANCEL_CONFIRMATION_YES'} defaultMessage={'Yes'}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

CancelConfirmation.propTypes = {
    close: PropTypes.func,
    onBack: PropTypes.func
};

export default CancelConfirmation;
