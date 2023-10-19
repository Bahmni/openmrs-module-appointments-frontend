import React, {useEffect, useState} from "react";
import {FormattedMessage, injectIntl} from "react-intl";
import PropTypes from "prop-types";
import {Modal} from "carbon-components-react";


const UpdateConfirmationModal = (props) => {

    const {save, show} = props;
    const [open, setOpen] = useState(true);
    useEffect(()=>{
        setOpen(true);
    }, [show])
    const closeModal = () =>{
        setOpen(false);
    }
    const body = <FormattedMessage id={'APPOINTMENT_UPDATE_CONFIRMATION_TEXT_SINGLE_APPOINTMENT'}
                              defaultMessage={'This will update the details of the selected appointment.'}/>

    const title=<FormattedMessage id={'APPOINTMENT_UPDATE_CONFIRMATION_TITLE'} defaultMessage={"Kindly Confirm"} />

    const primaryButtonText = <FormattedMessage id={'APPOINTMENT_UPDATE_CONFIRMATION_YES'} defaultMessage={'Yes, I confirm'}/>

    const secondaryText = <FormattedMessage id={'APPOINTMENT_UPDATE_CONFIRMATION_NO'} defaultMessage={"No, go back"}/>

    return (
        <Modal
            open={open}
            onRequestClose={closeModal}
            onSecondarySubmit={closeModal}
            preventCloseOnClickOutside={true}
            modalHeading={title}
            primaryButtonText={primaryButtonText}
            secondaryButtonText={secondaryText}
            onRequestSubmit={save}>
            {body}
        </Modal>
    );
};

UpdateConfirmationModal.propTypes = {
    close: PropTypes.func,
    save: PropTypes.func,
    updateSeries: PropTypes.bool
};


export default injectIntl(UpdateConfirmationModal);
