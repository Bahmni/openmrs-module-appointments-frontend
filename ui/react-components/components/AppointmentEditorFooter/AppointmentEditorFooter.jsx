import classNames from "classnames";
import {
    button,
    footer,
    footerElements,
    cancelPopup,
    save
} from "../AppointmentEditorFooter/AppointmentEditorFooter.module.scss";
import React from "react";
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";
import CancelConfirmation from "../CancelConfirmation/CancelConfirmation.jsx";
import CustomPopup from "../CustomPopup/CustomPopup.jsx";
import {customPopup} from "../CustomPopup/CustomPopup.module.scss";
import {AppContext} from "../AppContext/AppContext";


const AppointmentEditorFooter = props => {

    const {checkAndSave, isEdit} = props;

    const popupContent = <CancelConfirmation onBack={React.useContext(AppContext).onBack}/>;

    const cancelButton = <button className={classNames(button)} data-testid="cancel">
                            <i className={classNames("fa", "fa-times")}/>
                            <span><FormattedMessage id={'APPOINTMENT_CREATE_CANCEL'} defaultMessage={'Cancel'}/></span>
                        </button>;

    return (
        <div className={classNames(footer)}>
            <div className={classNames(footerElements)}>
                <CustomPopup triggerComponent={cancelButton} popupContent={popupContent} style={customPopup}/>
                {isEdit
                    ? <button className={classNames(button, save)} onClick={checkAndSave} data-testid="check-and-save">
                        <i className={classNames("fa", "fa-check")}/>
                        <span>
                        <FormattedMessage id={'APPOINTMENT_UPDATE_LABEL'} defaultMessage={'Update'}/>
                    </span>
                    </button>
                    : <button className={classNames(button, save)} onClick={checkAndSave} data-testid="check-and-save">
                        <i className={classNames("fa", "fa-check")}/>
                        <span>
                        <FormattedMessage id={'APPOINTMENT_CREATE_CHECK_AND_SAVE'} defaultMessage={'Check and Save'}/>
                    </span>
                    </button>}
            </div>
        </div>
    );
};

AppointmentEditorFooter.propTypes = {
    checkAndSave: PropTypes.func,
    isEdit: PropTypes.bool
};

export default AppointmentEditorFooter;
