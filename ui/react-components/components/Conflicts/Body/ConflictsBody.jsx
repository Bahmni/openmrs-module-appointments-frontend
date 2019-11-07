import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import React, {useState} from "react";
import "react-tabs/style/react-tabs.css";
import classNames from 'classnames';
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";
import {
    conflictsCount,
    conflictsHeading,
    appointmentConflict,
    boldContent,
    conflictMessage,
    conflictDetails,
    conflictsList
} from './ConflictsBody.module.scss';
import moment from 'moment';

const ConflictsBody = props => {
    const {service, conflicts} = props;
    const serviceUnavailableConflicts = conflicts.SERVICE_UNAVAILABLE;
    const patientDoubleBookingConflicts = conflicts.PATIENT_DOUBLE_BOOKING;
    const OVERLAPPING_CONFLICTS_CONTENT = "Overlapping conflicts content";
    const SERVICE_UNAVAILABLE_CONTENT = "No-Service Date conflicts content";
    const createTabs = () => {
        let tabHeads = [];
        let tabPanels = [];
        if (patientDoubleBookingConflicts) {
            tabHeads.push(createTab(patientDoubleBookingConflicts, 'OVERLAPPING_CONFLICTS', 'Overlapping conflicts'));
            tabPanels.push(createTabPanel(patientDoubleBookingConflicts, OVERLAPPING_CONFLICTS_CONTENT));
        }
        if (serviceUnavailableConflicts) {
            tabHeads.push(createTab(serviceUnavailableConflicts, 'NO_SERVICE_DATE_CONFLICTS', 'No-Service Date conflicts'));
            tabPanels.push(createTabPanel(serviceUnavailableConflicts, SERVICE_UNAVAILABLE_CONTENT));
        }
        return {tabHeads, tabPanels};
    };

    const createTab = (conflicts, translationKey, defaultMessage) => {
        return <Tab key={defaultMessage}>
            <span>
                <FormattedMessage id={translationKey} defaultMessage={defaultMessage}/>
                <span className={conflictsCount}>{conflicts.length}</span>
            </span>
        </Tab>
    };

    const createTabPanel = (conflicts, key) => {
        return <TabPanel key={key}>{getContent(conflicts, key)}</TabPanel>
    };

    const getContent = (conflicts, key) => {
        if (key === OVERLAPPING_CONFLICTS_CONTENT) {
            return createDoubleBookingConflictsContent(conflicts);
        }
        if (key === SERVICE_UNAVAILABLE_CONTENT) {
            return createServiceUnavailableConflictsContent(conflicts);
        }
    };

    const createServiceUnavailableConflictsContent = conflicts => {
        let list = [];
        conflicts.forEach((conflict, index) => {
            list.push(<div className={classNames(appointmentConflict)} key={index}>
                <div className={conflictDetails}>{getAppointmentConflictDetails(conflict)}</div>
            </div>);
        });
        const defaultMessage = `The ${service.name} service you had selected for the appointment(s) is not 
                                available during below listed dates`;
        return (
            <div>
                <div className={classNames(conflictsHeading)}>
                    <FormattedMessage id="NO_SERVICE_CONFLICTS_DEFAULT_TEXT" defaultMessage={defaultMessage}/>
                </div>
                <div className={conflictsList}>
                    <ul>{list}</ul>
                </div>
            </div>
        );
    };

    const createDoubleBookingConflictsContent = conflicts => {
        let list = [];
        conflicts.forEach((conflict, index) => {
            list.push(
                <div className={classNames(appointmentConflict)} key={index}>
                    {getDoubleBookingAppointmentConflictMessage(conflict)}
                    <div className={conflictDetails}>{getAppointmentConflictDetails(conflict)}</div>
                </div>);
        });
        const defaultMessage = "The recurring appointments you are trying to book overlaps with the following dates";
        return (
            <div>
                <div className={classNames(conflictsHeading)}>
                    <FormattedMessage id="OVERLAPPING_CONFLICTS_DEFAULT_TEXT" defaultMessage={defaultMessage}/>
                </div>
                <div className={conflictsList}>
                    <ul>{list}</ul>
                </div>
            </div>
        );
    };

    const getDoubleBookingAppointmentConflictMessage = conflict => {
        const currentAppointmentService = service.name;
        const existingAppointmentService = conflict.service.name;
        return (
            <div className={conflictMessage}>Current {currentAppointmentService} request
                <span className={classNames(boldContent)}> conflicts with {existingAppointmentService} </span>
                appointment on
            </div>
        );
    };

    const getAppointmentConflictDetails = conflict => {
        let appointmentConflictDetails = "";
        const appointmentStartDateTime = conflict.startDateTime;
        appointmentConflictDetails += moment(appointmentStartDateTime).format('Do');
        appointmentConflictDetails += ' ' + moment(appointmentStartDateTime).format('MMMM');
        appointmentConflictDetails += ' ‘' + moment(appointmentStartDateTime).format('YY');
        appointmentConflictDetails += ' | ' + moment(appointmentStartDateTime).format('dddd');
        appointmentConflictDetails += ' | ' + moment(appointmentStartDateTime).format('LT');

        return appointmentConflictDetails;
    };

    const [tabs] = useState(createTabs());


    return tabs && tabs.tabHeads.length > 0 ? (
        <Tabs>
            <TabList>{tabs.tabHeads}</TabList>
            {tabs.tabPanels}
        </Tabs>

    ) : null;

};

ConflictsBody.propTypes = {
    conflicts: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired
};

export default ConflictsBody;
