import React, {useState} from "react";
import classNames from 'classnames';
import PropTypes from "prop-types";
import {useIntl} from "react-intl";
import {conflictsBody, conflictsWarningMessage, tabPanelContent, conflictsTabs} from './ConflictsBody.module.scss';
import PatientDoubleBookingConflicts from "../PatientDoubleBookingConflicts.jsx";
import ServiceUnavailableConflicts from "../ServiceUnavailableConflicts.jsx";
import {Tab, Tabs} from "carbon-components-react";
import { WarningAltFilled24 } from '@carbon/icons-react';

const styles = {
    conflictsWarningIcon : {
        "position": "absolute",
        "width": "21px",
        "height": "20.25px",
        "color": "#DA1E28",
    },
    conflictsTabPanel : {
        "font-weight": "400",
        "font-size": "14px",
        "line-height": "12px",
        "color": "#393939",
      }
}


const ConflictsBody = props => {
    const {service, conflicts, isRecurring} = props;
    const serviceUnavailableConflicts = conflicts.SERVICE_UNAVAILABLE;
    const patientDoubleBookingConflicts = conflicts.PATIENT_DOUBLE_BOOKING;
    const OVERLAPPING_CONFLICTS_CONTENT = "Overlapping conflicts content";
    const SERVICE_UNAVAILABLE_CONTENT = "No-Service Date conflicts content";
    const intl = useIntl();
    const overlappingConflictsLabel = intl.formatMessage({id: 'OVERLAPPING_CONFLICTS', defaultMessage: 'Overlapping conflicts'});
    const serviceConflictsLabel = intl.formatMessage({id: 'NO_SERVICE_DATE_CONFLICTS', defaultMessage: 'No-Service Date conflicts'});
    let conflictsWarningHeader = "";
    const createTabs = () => {
        let tabHeads = [];
        if (patientDoubleBookingConflicts) {
            tabHeads.push(createTab(patientDoubleBookingConflicts, overlappingConflictsLabel, OVERLAPPING_CONFLICTS_CONTENT));
            conflictsWarningHeader = intl.formatMessage({id: 'OVERLAPPING_CONFLICTS_WARNING_HEADER', defaultMessage: 'You have an overlapping conflict'});
        }
        if (serviceUnavailableConflicts) {
            tabHeads.push(createTab(serviceUnavailableConflicts, serviceConflictsLabel, SERVICE_UNAVAILABLE_CONTENT));
            conflictsWarningHeader = intl.formatMessage({id: 'NO_SERVICE_DATE_CONFLICTS_WARNING_HEADER', defaultMessage: 'You have a no-service date conflict'});
        }
        if (patientDoubleBookingConflicts && serviceUnavailableConflicts) {
            conflictsWarningHeader = intl.formatMessage({id: 'OVERLAPPING_AND_NO_SERVICE_DATE_CONFLICTS_WARNING_HEADER', defaultMessage: 'You have an overlapping and no-service date conflict'});
        }
        return {tabHeads};
    };

    const createTab = (conflicts, label, key) => {
        return <Tab style={styles.conflictsTabPanel} data-testid={"conflict-tab"} label={label}>
                    <div className={classNames(tabPanelContent)}>{getContent(conflicts, key)}</div>
                </Tab>
    };

    const getContent = (conflicts, key) => {
        if (key === OVERLAPPING_CONFLICTS_CONTENT) {
            return (<PatientDoubleBookingConflicts conflicts={conflicts} service={service} isRecurring={isRecurring}/>);
        }
        if (key === SERVICE_UNAVAILABLE_CONTENT) {
            return <ServiceUnavailableConflicts conflicts={conflicts} service={service}/>;
        }
    };

    const [tabs] = useState(createTabs());

    return tabs && tabs.tabHeads.length > 0 ? (
        <div className={classNames(conflictsBody)}>
            <div>
                <WarningAltFilled24 style={styles.conflictsWarningIcon}/>
                <span className={classNames(conflictsWarningMessage)}>{conflictsWarningHeader}</span>
            </div>
            <div className={classNames(conflictsTabs)}>
                <Tabs>
                    {tabs.tabHeads}
                </Tabs>
            </div>
        </div>
    ) : null;

};

ConflictsBody.propTypes = {
    conflicts: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired
};

export default ConflictsBody;
