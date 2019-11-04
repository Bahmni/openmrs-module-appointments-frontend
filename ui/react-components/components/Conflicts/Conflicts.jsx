import React from "react";
import ConflictsFooter from "./Footer/ConflictsFooter.jsx";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";


const Conflicts = props => {

    return (
        <div className="conflicts">
            <ConflictsFooter saveAnyway={props.saveAnyway} modifyInformation={props.modifyInformation}/>
        </div>
    )
};
Conflicts.proptypes = {
    saveAnyway: PropTypes.func,
    modifyInformation: PropTypes.func
};
export default injectIntl(Conflicts);
