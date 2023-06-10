import { FormattedMessage } from "react-intl";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {CANCEL_CONFIRMATION_MESSAGE_ADD, CANCEL_CONFIRMATION_MESSAGE_EDIT} from "../../constants";
import {Modal} from "carbon-components-react";
import Label from "../Label/Label.jsx";

const CancelConfirmationWrapper = props => {
    const {onBack, appointmentUuid, show, resetEditConflict } =props;

    useEffect(()=>{
        setOpen(true);
    }, [show])

    const cancelConfirmationMessage =  appointmentUuid
        ? CANCEL_CONFIRMATION_MESSAGE_EDIT : CANCEL_CONFIRMATION_MESSAGE_ADD;
    const [open, setOpen] = useState(true);

    const title = <FormattedMessage id={'APPOINTMENT_CANCEL_CONFIRMATION_TITLE'} defaultMessage={"Discard appointment?"} />
    const body = <Label translationKey={cancelConfirmationMessage.translationKey} defaultValue={cancelConfirmationMessage.defaultMessage}/>
    const secondaryText = <FormattedMessage id={'NO_KEY'} defaultMessage={"No"}/>
    const primaryText = <FormattedMessage id={'YES_KEY'} defaultMessage={"Yes"}/>
    const closeModal = () =>{
        setOpen(false);
        resetEditConflict();
    }
    return (
        <Modal
            open={open}
            danger
            onRequestClose={closeModal}
            onSecondarySubmit={closeModal}
            preventCloseOnClickOutside={true}
            modalHeading={title}
            primaryButtonText={primaryText}
            secondaryButtonText={secondaryText}
            onRequestSubmit={onBack}>
                {body}
        </Modal>
    );
};

CancelConfirmationWrapper.propTypes = {
    onBack: PropTypes.func.isRequired,
    resetEditConflict: PropTypes.func,
    appointmentUuid: PropTypes.string.isRequired
};

export default CancelConfirmationWrapper;
