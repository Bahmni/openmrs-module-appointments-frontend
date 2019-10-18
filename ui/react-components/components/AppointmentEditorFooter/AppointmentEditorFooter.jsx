import classNames from "classnames";
import {button, footer, footerElements, save} from "../AppointmentEditorFooter/AppointmentEditorFooter.module.scss";
import React from "react";
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";

const AppointmentEditorFooter = props => {

    const {checkAndSave} = props;

    return (
        <div className={classNames(footer)}>
            <div className={classNames(footerElements)}>
                <button className={classNames(button)} data-testid="cancel">
                    <i className={classNames("fa", "fa-times")}/>
                    <span>
                        <FormattedMessage id={'APPOINTMENT_CREATE_CANCEL'} defaultMessage={'Cancel'}/>
                    </span>
                </button>
                <button className={classNames(button, save)} onClick={checkAndSave} data-testid="check-and-save">
                    <i className={classNames("fa", "fa-check")}/>
                    <span>
                        <FormattedMessage id={'APPOINTMENT_CREATE_CHECK_AND_SAVE'} defaultMessage={'Check and Save'}/>
                    </span>
                </button>
            </div>
        </div>
    );
};

AppointmentEditorFooter.propTypes = {
    checkAndSave: PropTypes.func.isRequired
};

export default AppointmentEditorFooter;
