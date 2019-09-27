import React, {Fragment} from "react";
import classNames from 'classnames';
import {appointmenteditor, overlay} from './AppointmentEditor.module.scss';

export const AppointmentEditor = () => {
    return (<Fragment>
        <div data-testid="overlay" className={classNames(overlay)}></div>
        <div data-testid="appointment-editor"
             className={classNames(appointmenteditor)}>
        </div>
    </Fragment>);
}
