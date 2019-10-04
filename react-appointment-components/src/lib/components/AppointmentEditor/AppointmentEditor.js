import React, {Fragment} from "react";
import classNames from 'classnames';
import {appointmenteditor, patientSearch} from './AppointmentEditor.module.scss';

const AppointmentEditor = () => {
    return (<Fragment>
        <div data-testid="appointment-editor"
             className={classNames(appointmenteditor)}>
            <div className={classNames(patientSearch)}>
                <span>About to add Patient Search here</span>
            </div>
        </div>
    </Fragment>);
};

export default AppointmentEditor