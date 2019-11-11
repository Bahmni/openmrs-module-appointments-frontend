import classNames from "classnames";
import {
    appointmentConflict,
    boldContent,
    conflictDetails,
    conflictMessage,
    conflictsHeading,
    conflictsList
} from "./Body/ConflictsBody.module.scss";
import {FormattedMessage} from "react-intl";
import React from "react";
import PropTypes from "prop-types";
import {getAppointmentConflictDetails} from "./ConflictsUtil";

const PatientDoubleBookingConflicts = props => {

    const getDoubleBookingAppointmentConflictMessage = conflict => {
        const currentAppointmentService = props.service.name;
        const existingAppointmentService = conflict.service.name;
        return (
            <div className={classNames(conflictMessage)}>Current {currentAppointmentService} request
                <span className={classNames(boldContent)}> conflicts with {existingAppointmentService} </span>
                appointment on
            </div>
        );
    };

    const getConflictsList = () => {
        let conflictsList = [];
        props.conflicts.forEach((conflict, index) => {
            conflictsList.push(
                <div className={classNames(appointmentConflict)} key={index}>
                    {getDoubleBookingAppointmentConflictMessage(conflict)}
                    <div className={classNames(conflictDetails)}>{getAppointmentConflictDetails(conflict)}</div>
                </div>);
        });
        return conflictsList;
    };

    const defaultMessage = "The recurring appointments you are trying to book overlaps with the following dates";
    return (
        <div>
            <div className={classNames(conflictsHeading)}>
                <FormattedMessage id="OVERLAPPING_CONFLICTS_DEFAULT_TEXT" defaultMessage={defaultMessage}/>
            </div>
            <div className={classNames(conflictsList)}>
                <ul>{getConflictsList()}</ul>
            </div>
        </div>
    );
};

PatientDoubleBookingConflicts.propTypes = {
    conflicts: PropTypes.array.isRequired,
    service: PropTypes.object.isRequired
};

export default PatientDoubleBookingConflicts;
