import classNames from "classnames";
import {updateOptions, updateOneButton, updateAllButton, save} from "../EditAppointment/UpdateButtons.module.scss";
import {FormattedMessage} from "react-intl";
import React from "react";

const UpdateButtons = () => {

    return (
        <div className={classNames(updateOptions)}>
            <div><button className={classNames(updateOneButton, save)}
                    data-testid="check-and-save">
                <i className={classNames("fa", "fa-check")}/>
                <span>
                        <FormattedMessage id={'APPOINTMENT_UPDATE_LABEL'} defaultMessage={"Update for today's date"}/>
                    </span>
            </button></div>

            <div><button className={classNames(updateAllButton, save)}
                    data-testid="check-and-save">
                <i className={classNames("fa", "fa-check")}/>
                <span>
                    <FormattedMessage id={'APPOINTMENT_UPDATE_LABEL'} defaultMessage={'Auto Update all occurrences'}/>
                    </span>
            </button></div>
        </div>);
};

export default UpdateButtons;
