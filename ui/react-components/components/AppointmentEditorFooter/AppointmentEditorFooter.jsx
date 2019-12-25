import classNames from "classnames";
import {
    button,
    footer,
    footerElements,
    cancelPopup,
    save,
    errorMessageContainer
} from "../AppointmentEditorFooter/AppointmentEditorFooter.module.scss";
import React, {useState} from "react";
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";
import CancelConfirmation from "../CancelConfirmation/CancelConfirmation.jsx";
import CustomPopup from "../CustomPopup/CustomPopup.jsx";
import {customPopup} from "../CustomPopup/CustomPopup.module.scss";
import {AppContext} from "../AppContext/AppContext";
import UpdateButtons from "../EditAppointment/UpdateButtons.jsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.jsx";


const AppointmentEditorFooter = props => {

    const {checkAndSave, isEdit, isOptionsRequired, disableUpdateButton, cancelConfirmationMessage, errorMessage} = props;
    const[showUpdateButtons, setShowUpdateButtons] = useState(false);

    const getUpdateButtons =() =>{
        setShowUpdateButtons(!showUpdateButtons);
    };

    const popupContent = <CancelConfirmation {...cancelConfirmationMessage} onBack={React.useContext(AppContext).onBack}/>;

    const cancelButton = <button className={classNames(button)} data-testid="cancel">
                            <i className={classNames("fa", "fa-times")}/>
                            <span><FormattedMessage id={'APPOINTMENT_CREATE_CANCEL'} defaultMessage={'Cancel'}/></span>
                        </button>;

    return (
        <div>
            <div className={classNames(errorMessageContainer)}>
                <ErrorMessage message={errorMessage} />
            </div>
        <div className={classNames(footer)}>
            <div className={classNames(footerElements)}>
                <CustomPopup triggerComponent={cancelButton} popupContent={popupContent} style={customPopup}/>
                {isEdit
                    ? <button className={classNames(button, save)}
                              onClick={() => isOptionsRequired ? getUpdateButtons() : checkAndSave(undefined)}
                              disabled={disableUpdateButton}
                              data-testid="check-and-save">
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
                {isOptionsRequired && showUpdateButtons ? <UpdateButtons updateOptionsVisibleStatus={setShowUpdateButtons} checkAndSave={applyForAll =>  checkAndSave(applyForAll)} /> : undefined}

            </div>
        </div>
        </div>
    );
};

AppointmentEditorFooter.propTypes = {
    checkAndSave: PropTypes.func,
    isEdit: PropTypes.bool,
    isOptionsRequired: PropTypes.bool,
    disableUpdateButton: PropTypes.bool,
    cancelConfirmationMessage: PropTypes.shape({
      translationKey: PropTypes.string.isRequired,
      defaultMessage: PropTypes.string.isRequired
    }),
    errorMessage: PropTypes.string
};

export default AppointmentEditorFooter;
