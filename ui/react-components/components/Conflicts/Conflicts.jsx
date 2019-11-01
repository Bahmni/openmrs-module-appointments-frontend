import React from "react";
import ConflictsFooter from "./Footer/ConflictsFooter.jsx";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";


const Conflicts = props => {

    return (
        <div className="conflicts">
            <ConflictsFooter saveAnyway={props.saveAnyway}/>
        </div>
    )
};
Conflicts.proptypes = {
    saveAnyway: PropTypes.func
};
export default injectIntl(Conflicts);
