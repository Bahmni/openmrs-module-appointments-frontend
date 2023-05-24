import classNames from "classnames";
import {updateOptions, updateButton} from "../EditAppointment/UpdateButtons.module.scss";
import {FormattedMessage} from "react-intl";
import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {Button} from "carbon-components-react";
const UpdateButtons = (props) => {

    const {updateOptionsVisibleStatus, checkAndSave} = props;

    useEffect(() => {
        return () => updateOptionsVisibleStatus(false);
    });

    return (
        <div className={classNames(updateOptions)}>
            <Button kind={"primary"} className={classNames(updateButton)} onClick={() => checkAndSave(false)}
                    data-testid="check-and-save">
                <span>
                        <FormattedMessage id={'APPOINTMENT_UPDATE_ONE_LABEL'} defaultMessage={"Update this occurrence"}/>
                </span>
            </Button>
            <Button kind={"primary"} className={classNames(updateButton)} onClick={() => checkAndSave(true)}
                    data-testid="check-and-save">
                <span>
                    <FormattedMessage id={'APPOINTMENT_UPDATE_ALL_LABEL'} defaultMessage={'Update all occurrences'}/>
                </span>
            </Button>
        </div>);
};

UpdateButtons.propTypes = {
    checkAndSave: PropTypes.func
};

export default UpdateButtons;
