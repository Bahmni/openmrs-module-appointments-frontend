import React, {Fragment, useState} from "react";
import classNames from 'classnames';
import {
    appointmenteditor,
    searchFieldsContainerRight,
    searchFieldsContainerLeft,
    searchFieldsContainer
} from './AppointmentEditor.module.scss';
import PatientSearch from "../PatientSearch/PatientSearch.jsx";
import ServiceSearch from "../Service/ServiceSearch.jsx";
import ServiceTypeSearch from "../Service/ServiceTypeSearch.jsx";
import ProviderSearch from "../Provider/ProviderSearch.jsx";
import LocationSearch from "../Location/LocationSearch.jsx";
import SpecialitySearch from "../Speciality/SpecialitySearch.jsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.jsx";

export const AppointmentEditor = () => {
    const [patient, setPatient] = useState();
    const [providers, setProviders] = useState([]);
    const [service, setService] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [location, setLocation] = useState('');
    const [speciality, setSpeciality] = useState('');


    return (<Fragment>
        <div data-testid="appointment-editor" className={classNames(appointmenteditor)}>
            <div className={classNames(searchFieldsContainer)}>
                <div className={classNames(searchFieldsContainerLeft)}>
                    <div>
                        <PatientSearch onChange={(optionSelected) => setPatient(optionSelected.value)}/>
                    </div>
                    <div>
                        <ServiceSearch onChange={(optionSelected) => setService(optionSelected.value)}/>
                        <ErrorMessage />
                    </div>
                    <div>
                        <ServiceTypeSearch onChange={(optionSelected) => setServiceType(optionSelected.value)}
                                           serviceUuid={service}/>
                    </div>
                    <div>
                        <SpecialitySearch onChange={(optionSelected) => setSpeciality(optionSelected.value)}/>
                    </div>
                    <div>
                        <LocationSearch onChange={(optionSelected) => setLocation(optionSelected.value)}/>
                    </div>
                </div>
                <div className={classNames(searchFieldsContainerRight)}>
                    <ProviderSearch onChange={selectedProviders => setProviders(selectedProviders)}/>
                </div>
            </div>
        </div>
    </Fragment>);
};
