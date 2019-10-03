import React, {Fragment} from "react";
import classNames from 'classnames';
import {appointmenteditor, patientSearch} from './AppointmentEditor.module.scss';
import PatientSearch from "../PatientSearch/PatientSearch.jsx";

export const AppointmentEditor = () => {
    return (<Fragment>
        <div data-testid="appointment-editor"
             className={classNames(appointmenteditor)}>
            <div className={classNames(patientSearch)}>
                <PatientSearch/>
            </div>
        </div>
    </Fragment>);
};
