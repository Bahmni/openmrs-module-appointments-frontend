import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {notes} from './AppointmentNotes.module.scss'

const AppointmentNotes = (props) => (
        <Fragment>
            <textarea value={props.value || ''} className={classNames(notes)} onChange={props.onChange} data-testid="notes"/>
        </Fragment>
);

AppointmentNotes.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string
};

export default AppointmentNotes;

