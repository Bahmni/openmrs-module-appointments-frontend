import React, {Fragment, useState} from "react";
import classNames from 'classnames';
import {appointmenteditor, patientServiceSearch, providerSearch, searchFieldsContainer} from './AppointmentEditor.module.scss';
import PatientSearch from "../PatientSearch/PatientSearch.jsx";
import ServiceSearch from "../Service/ServiceSearch.jsx";
import ServiceTypeSearch from "../Service/ServiceTypeSearch.jsx";
import ProviderSearch from "../Provider/ProviderSearch.jsx";

export const AppointmentEditor = () => {
    const [patient, setPatient] = useState();
    const [providers, setProviders] = useState([]);
    const [serviceUuid, setServiceUuid] = useState('');

    return (<Fragment>
        <div data-testid="appointment-editor"
             className={classNames(appointmenteditor)}>

            <div className={classNames(searchFieldsContainer)}>
                <div className={classNames(patientServiceSearch)}>
                    <PatientSearch onChange={(optionSelected) => setPatient(optionSelected.value) }/>
                    <ServiceSearch onChange={(optionSelected) => setServiceUuid(optionSelected.value)}/>
                    <ServiceTypeSearch serviceUuid={serviceUuid} />
                </div>
                <div className={classNames(providerSearch)}>
                    <ProviderSearch onChange={selectedProviders => setProviders(selectedProviders)}/>
                </div>
            </div>
        </div>
    </Fragment>);
};
