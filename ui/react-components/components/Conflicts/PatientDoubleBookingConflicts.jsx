import classNames from "classnames";
import {
  appointmentConflict,
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

    const doubleBookingConflictMessage = 'Current {currentAppointmentService} request conflicts with {existingAppointmentService} appointment on and';

    const getDoubleBookingAppointmentConflictMessage = conflict => {
        const currentAppointmentService = props.service.label;
        const existingAppointmentService = conflict.service.name;
      let formattedMessage = <FormattedMessage id="PATIENT_DOUBLE_BOOKING_CONFLICT_MESSAGE"
                                               defaultMessage={doubleBookingConflictMessage}
                                               values={{
                                                 currentAppointmentService,
                                                 existingAppointmentService: <strong>{existingAppointmentService}</strong>
                                               }}/>;
      return (<div className={classNames(conflictMessage)}>{formattedMessage}</div>);
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

    const defaultMessage = "The appointment you are trying to book overlaps with the following dates";
    const recurringDefaultMessage = "The recurring appointments you are trying to book overlaps with the following dates";
    return (
        <div>
            <div className={classNames(conflictsHeading)}>
            {props.isRecurring
                ? <FormattedMessage id="RECURRING_OVERLAPPING_CONFLICTS_DEFAULT_TEXT" defaultMessage={recurringDefaultMessage}/>
                : <FormattedMessage id="OVERLAPPING_CONFLICTS_DEFAULT_TEXT" defaultMessage={defaultMessage}/>
            }
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
