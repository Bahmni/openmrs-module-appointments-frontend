import React, {Fragment, useState} from "react";
import classNames from 'classnames';
import {appointmenteditor, patientSearch} from './AppointmentEditor.module.scss';
import PatientSearch from "../PatientSearch/PatientSearch.jsx";

export const AppointmentEditor = () => {
    const [patient, setPatient] = useState();
    console.log(patient)
    return (<Fragment>
        <div data-testid="appointment-editor"
             className={classNames(appointmenteditor)}>
            <div className={classNames(patientSearch)}>
                <PatientSearch onChange={(optionSelected) => setPatient(optionSelected.value) }/>
            </div>
        </div>
    </Fragment>);
};
