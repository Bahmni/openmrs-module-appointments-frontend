import React, {Fragment, useState} from "react";
import classNames from 'classnames';
import {
    appointmenteditor,
    patientServiceSearch,
    providerSearch,
    searchFieldsContainer
} from './AppointmentEditor.module.scss';
import PatientSearch from "../PatientSearch/PatientSearch.jsx";
import ServiceSearch from "../Service/ServiceSearch.jsx";
import ServiceTypeSearch from "../Service/ServiceTypeSearch.jsx";
import ProviderSearch from "../Provider/ProviderSearch.jsx";

export const AppointmentEditor = () => {
    const [patient, setPatient] = useState();
    const [providers, setProviders] = useState([]);
    const [service, setService] = useState('');
    const [serviceType, setServiceType] = useState('');

    return (<Fragment>
        <div data-testid="appointment-editor" className={classNames(appointmenteditor)}>
            <div className={classNames(searchFieldsContainer)}>
                <div className={classNames(patientServiceSearch)}>
                    <PatientSearch onChange={(optionSelected) => setPatient(optionSelected.value) }/>
                    <ServiceSearch onChange={(optionSelected) => setService(optionSelected.value)}/>
                    <ServiceTypeSearch onChange={(optionSelected) => setServiceType(optionSelected.value)} serviceUuid={service} />
                </div>
                <div className={classNames(providerSearch)}>
                    <ProviderSearch onChange={selectedProviders => setProviders(selectedProviders)}/>
                </div>
            </div>
        </div>
    </Fragment>);
};
