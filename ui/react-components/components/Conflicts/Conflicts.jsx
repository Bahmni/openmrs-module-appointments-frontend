import React from "react";
import ConflictsFooter from "./Footer/ConflictsFooter.jsx";
import ConflictsBody from "./Body/ConflictsBody.jsx";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import classNames from 'classnames';
import '../../carbon-theme.scss';
import {conflictsContainer, conflictsClose} from "./Conflicts.module.scss";
import useFocusLock from "../../utils/hooks/useFocusLock.jsx";
import { Close24 } from '@carbon/icons-react';

const Conflicts = props => {

    return (
        <div className={classNames(conflictsContainer)}>
            <div data-testid="conflicts">
                <div className={classNames(conflictsClose)} onClick={props.modifyInformation}>
                    <Close24/>
                </div>
                <div data-testid="conflicts-body">
                    <ConflictsBody conflicts={props.conflicts} service={props.service} isRecurring={props.isRecurring}/>
                </div>
            </div>
            <div data-testid="conflicts-footer">
                <ConflictsFooter saveAnyway={props.saveAnyway} modifyInformation={props.modifyInformation} disableSaveAnywayButton={props.disableSaveAnywayButton}/>
            </div>
        </div>
    )
};
Conflicts.proptypes = {
    saveAnyway: PropTypes.func.isRequired,
    modifyInformation: PropTypes.func.isRequired,
    conflicts: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired,
    disableSaveAnywayButton: PropTypes.bool
};
export default injectIntl(useFocusLock(Conflicts));
