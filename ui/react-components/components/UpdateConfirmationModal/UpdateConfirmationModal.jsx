import React from "react";
import {FormattedMessage, injectIntl} from "react-intl";
import PropTypes from "prop-types";
import CustomModalWithStateManager  from "../Modal/Modal.jsx";
import { Button } from "carbon-components-react";


const UpdateConfirmationModal = (props) => {

    const {save, triggerComponent} = props;
    const body = <FormattedMessage id={'APPOINTMENT_UPDATE_CONFIRMATION_TEXT_SINGLE_APPOINTMENT'}
                              defaultMessage={'This will update the details of the selected appointment. This cannot be reversed!'}/>

    const primaryButton = <Button kind={"primary"} onClick={save}>
        <FormattedMessage id={'APPOINTMENT_UPDATE_CONFIRMATION_YES'}
                          defaultMessage={'Yes, I confirm'}/>
    </Button>

    return <CustomModalWithStateManager titleKey={'APPOINTMENT_UPDATE_CONFIRMATION_TITLE'} defaultTitle={"Kindly Confirm"}
                           body={body} primaryButton={primaryButton} secondaryButtonKey={'APPOINTMENT_UPDATE_CONFIRMATION_NO'}
                           secondaryButtonDefaultValue={'No, go back'} triggerComponent={triggerComponent}/>
};

UpdateConfirmationModal.propTypes = {
    close: PropTypes.func,
    save: PropTypes.func,
    updateSeries: PropTypes.bool
};


export default injectIntl(UpdateConfirmationModal);
