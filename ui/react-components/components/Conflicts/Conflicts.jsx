import React from "react";
import ConflictsFooter from "./Footer/ConflictsFooter.jsx";
import ConflictsBody from "./Body/ConflictsBody.jsx";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";


const Conflicts = props => {

    return (
        <div className="conflicts">
            <div className="body">
                <ConflictsBody conflicts={props.conflicts}/>
            </div>
            <div className="footer">
                <ConflictsFooter saveAnyway={props.saveAnyway} modifyInformation={props.modifyInformation}/>
            </div>
        </div>
    )
};
Conflicts.proptypes = {
    saveAnyway: PropTypes.func,
    modifyInformation: PropTypes.func,
    conflicts: PropTypes.object
};
export default injectIntl(Conflicts);
