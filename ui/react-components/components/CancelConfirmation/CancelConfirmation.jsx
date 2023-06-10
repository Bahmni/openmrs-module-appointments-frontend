import React from "react";
import PropTypes from "prop-types";
import CustomModalWithStateManager from '../Modal/Modal.jsx';
import {AppContext} from "../AppContext/AppContext";
import {Button} from "carbon-components-react";
import Label from "../Label/Label.jsx";
import {FormattedMessage} from "react-intl";

const CancelConfirmation  = prop => {
    const { triggerComponent, onBack, skipConfirm } = prop
    const body = <FormattedMessage id={'APPOINTMENT_CANCEL_CONFIRMATION_TEXT'}
                                   defaultMessage={'You will lose appointment details. Do you want to discard these changes?'} />
    const primaryButton =  <Button
        kind="danger"
        onClick={onBack}>
        <Label translationKey={'DISCARD_KEY'} defaultValue={'Discard'}/>
    </Button>
    if(skipConfirm){
        return <span onClick={onBack}>
                    {triggerComponent}
                </span>
    }
    return <CustomModalWithStateManager onBack={React.useContext(AppContext).onBack}
                        triggerComponent={triggerComponent}
                        titleKey={'APPOINTMENT_CANCEL_CONFIRMATION_TITLE'}
                        defaultTitle={"Discard appointment?"}
                        body={body}
                        primaryButton={primaryButton}
                        />
}
CancelConfirmation.propTypes = {
    onBack: PropTypes.func,
    triggerComponent: PropTypes.element
};
export default CancelConfirmation;
