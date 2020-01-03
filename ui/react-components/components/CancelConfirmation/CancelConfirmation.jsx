import React, {useEffect, useRef} from "react";
import classNames from "classnames";
import {FormattedMessage} from "react-intl";
import {
    button,
    cancelModal,
    cancelModalBody,
    cancelModalCloseIcon,
    cancelModalTitle,
    no
} from "../CancelConfirmation/CancelConfirmation.module.scss";
import PropTypes from "prop-types";
import FocusLock from 'react-focus-lock';

const CancelConfirmation = (props) => {
    const {close, onBack, translationKey, defaultMessage, isFocusLocked} = props;
    const abortCancel = useRef(null);

    useEffect(() => abortCancel && abortCancel.current.focus());

    const content = () => <div className={classNames(cancelModal)}>
        <div className={classNames(cancelModalCloseIcon)}>
            <button data-testid="cancel-close-icon" onClick={close}>
                <i className={classNames("fa", "fa-times")}/>
            </button>
        </div>
        <div>
            <h1 className={classNames(cancelModalTitle)}>
                <FormattedMessage id={'APPOINTMENT_CANCEL_CONFIRMATION_TITLE'} defaultMessage={'Wait!'}/>
            </h1>
            <div className={classNames(cancelModalBody)}>
                <FormattedMessage id={translationKey} defaultMessage={defaultMessage}/>
            </div>
            <div>
                <button className={classNames(button, no)} ref={abortCancel} data-testid="cancel-no" onClick={close}>
                    <FormattedMessage id={'APPOINTMENT_CANCEL_CONFIRMATION_NO'} defaultMessage={'No'}/>
                </button>
                <button className={classNames(button)} data-testid="cancel-yes" onClick={onBack}>
                    <FormattedMessage id={'APPOINTMENT_CANCEL_CONFIRMATION_YES'} defaultMessage={'Yes'}/>
                </button>
            </div>
        </div>
    </div>;
    return isFocusLocked ? <FocusLock>{content()}</FocusLock> : content();
};
CancelConfirmation.propTypes = {
    close: PropTypes.func,
    onBack: PropTypes.func,
    translationKey: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    isFocusLocked: PropTypes.bool
};
export default CancelConfirmation;
