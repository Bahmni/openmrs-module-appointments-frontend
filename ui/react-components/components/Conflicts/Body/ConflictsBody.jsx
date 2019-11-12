import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import React, {useState} from "react";
import "react-tabs/style/react-tabs.css";
import classNames from 'classnames';
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";
import {conflictsCount} from './ConflictsBody.module.scss';
import PatientDoubleBookingConflicts from "../PatientDoubleBookingConflicts.jsx";
import ServiceUnavailableConflicts from "../ServiceUnavailableConflicts.jsx";

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
                <span className={classNames(conflictsCount)}>{conflicts.length}</span>
            </span>
        </Tab>
    };

    const createTabPanel = (conflicts, key) => {
        return <TabPanel key={key}>{getContent(conflicts, key)}</TabPanel>
    };

    const getContent = (conflicts, key) => {
        if (key === OVERLAPPING_CONFLICTS_CONTENT) {
            return (<PatientDoubleBookingConflicts conflicts={conflicts} service={service}/>);
        }
        if (key === SERVICE_UNAVAILABLE_CONTENT) {
            return <ServiceUnavailableConflicts conflicts={conflicts} service={service}/>;
        }
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
