import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {notes} from './AppointmentNotes.module.scss';
import {injectIntl} from "react-intl";
import { TextArea } from 'carbon-components-react'
import 'carbon-components/css/carbon-components.min.css';

const AppointmentNotes = (props) => {
    const {intl, onChange, value} = props;
    const placeHolder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_NOTES_MAX_LENGTH', defaultMessage: 'Maximum of 250 characters'
    });
    return (<Fragment>
            <TextArea value={value || ''} className={classNames(notes)} onChange={onChange}
                      data-testid="notes" maxLength="250" labelText={"Notes"} enableCounter={true}
                      placeholder={placeHolder}/>
        </Fragment>
    )
};

AppointmentNotes.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    intl: PropTypes.object.isRequired
};

export default injectIntl(AppointmentNotes);

