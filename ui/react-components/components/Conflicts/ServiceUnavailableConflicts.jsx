import classNames from "classnames";
import {appointmentConflict, conflictDetails, conflictsHeading, conflictsList} from "./Body/ConflictsBody.module.scss";
import {FormattedMessage} from "react-intl";
import React from "react";
import PropTypes from "prop-types";
import {getAppointmentConflictDetails} from "./ConflictsUtil";
import {sortBy} from "lodash";
import { ListItem, UnorderedList } from "carbon-components-react";

const ServiceUnavailableConflicts = props => {

    const getConflictsList = () => {
        const conflicts = sortBy(props.conflicts, conflict => conflict.startDateTime);
        let conflictList = conflicts.map(conflict => 
            <ListItem>
                <div className={classNames(appointmentConflict)}>
                    <div className={classNames(conflictDetails)}>{getAppointmentConflictDetails(conflict)}</div>
                </div>
            </ListItem>
            );
        return conflictList;
    };
    const defaultMessage = 'The {label} service you had selected for the appointment(s) is not available during below listed dates';

    return (
        <div>
            <div className={classNames(conflictsHeading)}>
                <FormattedMessage id="NO_SERVICE_CONFLICTS_DEFAULT_TEXT" defaultMessage={defaultMessage} values={{label: props.service.label}}/>
            </div>
            <div className={classNames(conflictsList)}>
                <UnorderedList nested>
                    {getConflictsList()}
                </UnorderedList>
            </div>
        </div>
    );
};

ServiceUnavailableConflicts.propTypes = {
    conflicts: PropTypes.array.isRequired,
    service: PropTypes.object.isRequired
};

export default ServiceUnavailableConflicts;
