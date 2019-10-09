import React, {Fragment, useState} from "react";
import classNames from 'classnames';
import {appointmenteditor, patientSearch} from './AppointmentEditor.module.scss';
import PatientSearch from "../PatientSearch/PatientSearch.jsx";
import ServiceSearch from "../Service/ServiceSearch.jsx";

export const AppointmentEditor = () => {
    const [patient, setPatient] = useState();
    const [serviceUuid, setServiceUuid] = useState('');
    return (<Fragment>
        <div data-testid="appointment-editor"
             className={classNames(appointmenteditor)}>
            <div className={classNames(patientSearch)}>
                <PatientSearch onChange={(optionSelected) => setPatient(optionSelected.value) }/>
                <ServiceSearch onChange={(optionSelected) => setServiceUuid(optionSelected.value)}/>
            </div>
        </div>
    </Fragment>);
};
