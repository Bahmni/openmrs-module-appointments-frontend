import React from "react";
import PropTypes from "prop-types";
import { CustomModal } from '../../Modal/Modal.jsx';
import {AppContext} from "../AppContext/AppContext";
import {Button} from "carbon-components-react";
import Label from "../Label/Label.jsx";

const CancelConfirmation  = prop => {
    const { triggerComponent, onBack } = prop
    const primaryButton =  <Button
        kind="danger"
        onClick={onBack}>
        <Label translationKey={'DISCARD_KEY'} defaultValue={'Discard'}/>
    </Button>
    return <CustomModal onBack={React.useContext(AppContext).onBack}
                        triggerComponent={triggerComponent}
                        titleKey={'APPOINTMENT_CANCEL_CONFIRMATION_TITLE'}
                        defaultTitle={"Discard appointment?"}
                        bodyKey={'APPOINTMENT_CANCEL_CONFIRMATION_TEXT'}
                        defaultBody={"You will loose appointment details. Do you want to discard these changes?"}
                        primaryButton={primaryButton}
                        />
}
CancelConfirmation.propTypes = {
    onBack: PropTypes.func,
    triggerComponent: PropTypes.element
};
export default CancelConfirmation;
