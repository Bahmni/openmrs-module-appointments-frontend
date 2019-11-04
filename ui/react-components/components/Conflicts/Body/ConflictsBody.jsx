import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import React, {useState} from "react";
import "react-tabs/style/react-tabs.css";
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";
import {conflictsCount} from './ConflictsModel.module.scss';

const ConflictsBody = props => {
    const serviceUnavailableConflicts = props.conflicts.SERVICE_UNAVAILABLE;
    const patientDoubleBookingConflicts = props.conflicts.PATIENT_DOUBLE_BOOKING;

    const createTabs = () => {
        let tabHeads = [];
        let tabPanels = [];
        if (patientDoubleBookingConflicts) {
            tabHeads.push(createTab(patientDoubleBookingConflicts, 'OVERLAPPING_CONFLICTS', 'Overlapping conflicts'));
            tabPanels.push(createTabPanel(patientDoubleBookingConflicts, 'Overlapping conflicts content'));
        }
        if (serviceUnavailableConflicts) {
            tabHeads.push(createTab(serviceUnavailableConflicts, 'NO_SERVICE_DATE_CONFLICTS', 'No-Service Date conflicts'));
            tabPanels.push(createTabPanel(serviceUnavailableConflicts, 'No-Service Date conflicts content'));
        }
        return {tabHeads, tabPanels};
    };

    const createTab = (conflicts, translationKey, defaultMessage) => {
        return <Tab key={defaultMessage} className="tab">
            <span>
                <FormattedMessage id={translationKey} defaultMessage={defaultMessage}/>
                    <span className={conflictsCount}>{conflicts.length}</span>
                </span>
        </Tab>
    };

    const getContent = conflicts => {
        let list = [];
        conflicts.forEach(conflict => {
            list.push(<span>{conflict.uuid}</span>);
        });
        return list;
    };

    const createTabPanel = (conflicts, key) => {
        return <TabPanel className="tabPanel" key={key}>{getContent(conflicts)}</TabPanel>
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
    conflicts: PropTypes.object
};

export default ConflictsBody;
