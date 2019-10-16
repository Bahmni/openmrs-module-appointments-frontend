import classNames from "classnames";
import {
    button,
    footer,
    footerElements,
    save
} from "../AppointmentEditorFooter/AppointmentEditorFooter.module.scss";
import React from "react";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";

const AppointmentEditorFooter = props => {

    const {intl, checkAndSave} = props;
    const saveButtonText = intl.formatMessage({
        id: 'APPOINTMENT_CREATE_CHECK_AND_SAVE', defaultMessage: 'Check and Save'
    });
    const cancelButtonText = intl.formatMessage({
        id: 'APPOINTMENT_CREATE_CANCEL', defaultMessage: 'Cancel'
    });

    return (
        <div className={classNames(footer)}>
            <div className={classNames(footerElements)}>
                <button className={classNames(button)}>
                    <i className={classNames("fa", "fa-times")}/>
                    <span>{cancelButtonText}</span>
                </button>
                <button className={classNames(button, save)} onClick={checkAndSave}>
                    <i className={classNames("fa", "fa-check")}/>
                    <span>{saveButtonText}</span>
                </button>
            </div>
        </div>
    );
};

AppointmentEditorFooter.propTypes = {
    intl: PropTypes.object.isRequired,
    checkAndSave: PropTypes.func.isRequired
};

export default injectIntl(AppointmentEditorFooter);
