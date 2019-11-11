import React from "react";
import ConflictsFooter from "./Footer/ConflictsFooter.jsx";
import ConflictsBody from "./Body/ConflictsBody.jsx";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";

const Conflicts = props => {

    return (
        <div data-testid="conflicts">
            <div data-testid="conflicts-body">
                <ConflictsBody conflicts={props.conflicts} service={props.service}/>
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
export default injectIntl(Conflicts);
