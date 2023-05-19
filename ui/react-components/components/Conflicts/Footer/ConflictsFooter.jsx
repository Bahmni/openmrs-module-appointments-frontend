import React from "react";
import classNames from "classnames";
import {conflictsFooter} from "./ConflictsFooter.module.scss";
import {FormattedMessage, injectIntl} from "react-intl";
import PropTypes from "prop-types";
import {Button} from "carbon-components-react";

const ConflictsFooter = props => {
    return (
        <div className={classNames(conflictsFooter)}>
            <div>
                <Button kind="secondary" style={{width: "270px", height: "64px" }} data-testid="conflictsModify" onClick={props.modifyInformation}>
                    <span>
                        <FormattedMessage id={'APPOINTMENT_MODIFY_INFORMATION'} defaultMessage={'Modify Information'}/>
                    </span>
                </Button>
                <Button kind="primary" style={{width: "270px", height: "64px" }} data-testid="conflictsSaveAnyway" onClick={props.saveAnyway} disabled={props.disableSaveAnywayButton}>
                    <span><FormattedMessage id={'APPOINTMENT_SAVE_ANYWAY'} defaultMessage={'Save Anyway'}/></span>
                </Button>
            </div>
        </div>
    )
};
ConflictsFooter.propTypes = {
    saveAnyway: PropTypes.func,
    modifyInformation: PropTypes.func,
    disableSaveAnywayButton: PropTypes.bool
};

export default injectIntl(ConflictsFooter);
