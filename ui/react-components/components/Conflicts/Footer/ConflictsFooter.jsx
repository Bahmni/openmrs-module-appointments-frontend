import React from "react";
import classNames from "classnames";
import {button, footer, footerElements, save} from "../../AppointmentEditorFooter/AppointmentEditorFooter.module.scss";
import {conflictsFooter} from "./ConflictsFooter.module.scss";
import {FormattedMessage, injectIntl} from "react-intl";
import PropTypes from "prop-types";

const ConflictsFooter = props => {
    return (
        <div className={classNames(footer, conflictsFooter)}>
            <div className={classNames(footerElements)}>
                <button className={classNames(button)} onClick={props.saveAnyway}>
                    <i className={classNames("fa", "fa-check")}/>
                    <span>
                        <FormattedMessage id={'APPOINTMENT_SAVE_ANYWAY'} defaultMessage={'Save Anyway'}/>
                    </span>
                </button>
                <button className={classNames(button, save)} onClick={props.modifyInformation}>
                    <i className={classNames("fa", "fa-edit")}/>
                    <span>
                        <FormattedMessage id={'APPOINTMENT_MODIFY_INFORMATION'} defaultMessage={'Modify information'}/>
                    </span>
                </button>
            </div>
        </div>
    )
};
ConflictsFooter.propTypes = {
    saveAnyway: PropTypes.func,
    modifyInformation: PropTypes.func
};

export default injectIntl(ConflictsFooter);
