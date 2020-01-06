import React from "react";
import ConflictsFooter from "./Footer/ConflictsFooter.jsx";
import ConflictsBody from "./Body/ConflictsBody.jsx";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import classNames from 'classnames';
import {conflictsContainer, button} from "./Conflicts.module.scss";
import useFocusLock from "../../utils/hooks/useFocusLock.jsx";

const Conflicts = props => {

    return (
        <div className={classNames(conflictsContainer)} data-testid="conflicts">
            <button className={classNames(button)} data-testid="conflictsCancel" onClick={props.modifyInformation}>
                <i className={classNames("fa", "fa-times")}/>
            </button>
            <div data-testid="conflicts-body">
                <ConflictsBody conflicts={props.conflicts} service={props.service} isRecurring={props.isRecurring}/>
            </div>
            <div data-testid="conflicts-footer">
                <ConflictsFooter saveAnyway={props.saveAnyway} modifyInformation={props.modifyInformation}/>
            </div>
        </div>
    )
};
Conflicts.proptypes = {
    saveAnyway: PropTypes.func.isRequired,
    modifyInformation: PropTypes.func.isRequired,
    conflicts: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired
};
export default injectIntl(useFocusLock(Conflicts));
