import React from "react";

import PropTypes from "prop-types";
import Label from "../Label/Label.jsx";
import classNames from 'classnames';
import {notes} from './AppointmentNotes.module.scss'

const AppointmentNotes = (props) => (
    <div>
        <Label translationKey={props.translationKey} defaultValue={props.defaultValue}/>
        <div>
            <textarea className={classNames(notes)} onChange={props.onChange}/>
        </div>
    </div>
);

AppointmentNotes.propTypes = {
    translationKey: PropTypes.string,
    defaultValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default AppointmentNotes;

