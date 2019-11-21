import classNames from "classnames";
import {updateOptions, updateOneButton, updateAllButton, save} from "../EditAppointment/UpdateButtons.module.scss";
import {FormattedMessage} from "react-intl";
import React from "react";
import PropTypes from "prop-types";

const UpdateButtons = (props) => {

    const {checkAndSave} = props;

    return (
        <div className={classNames(updateOptions)}>
            <button className={classNames(updateOneButton, save)} onClick={() => checkAndSave(false)}
                    data-testid="check-and-save">
                <span>
                        <FormattedMessage id={'APPOINTMENT_UPDATE_ONE_LABEL'} defaultMessage={"Update for today's date"}/>
                </span>
            </button>
            <button className={classNames(updateAllButton, save)} onClick={() => checkAndSave(true)}
                    data-testid="check-and-save">
                <span>
                    <FormattedMessage id={'APPOINTMENT_UPDATE_ALL_LABEL'} defaultMessage={'Auto Update all occurrences'}/>
                </span>
            </button>
        </div>);
};

UpdateButtons.propTypes = {
    checkAndSave: PropTypes.func
};

export default UpdateButtons;
