import {Tab, Tabs, TabList} from 'react-tabs';
import React, {useState} from "react";
import "react-tabs/style/react-tabs.css";
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";
import {conflictsCount} from './ConflictsModel.module.scss';

const ConflictsBody = props => {
    const serviceUnavailableConflicts = props.conflicts.SERVICE_UNAVAILABLE;
    const patientDoubleBookingConflicts = props.conflicts.PATIENT_DOUBLE_BOOKING;

    const createTabs = () => {
        let tabs = [];
        patientDoubleBookingConflicts && tabs.push(
            createTab(patientDoubleBookingConflicts, 'OVERLAPPING_CONFLICTS', 'Overlapping conflicts'));
        serviceUnavailableConflicts && tabs.push(
            createTab(serviceUnavailableConflicts, 'NO_SERVICE_DATE_CONFLICTS', 'No-Service Date conflicts'));
        return tabs;
    };

    const createTab = (conflict, translationKey, defaultMessage) => {
        return <Tab key={defaultMessage}>
            <span>
                <FormattedMessage id={translationKey} defaultMessage={defaultMessage}/>
                    <span className={conflictsCount}>{conflict.length}</span>
                </span>
        </Tab>
    };

    const [tabs] = useState(createTabs());

    return tabs.length ? (
        <Tabs>
            <TabList>{tabs}</TabList>
        </Tabs>
    ) : null;

};

ConflictsBody.propTypes = {
    conflicts: PropTypes.object
};

export default ConflictsBody;
