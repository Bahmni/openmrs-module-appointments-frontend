import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from "react-intl";
import { TextArea } from 'carbon-components-react'

const AppointmentNotes = (props) => {
    const {intl, onChange, value} = props;
    const placeHolder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_NOTES_MAX_LENGTH', defaultMessage: 'Maximum of 250 characters'
    });
    const [notes, setNotes] = useState(value);
    useEffect(()=>{
        setNotes(value);
    }, [value])
    const handleChange = props => {
        setNotes(props.target.value)
    }
    return (<div data-testid="notes">
            <TextArea value={notes || ""} onChange={handleChange} onBlur={onChange}
                      data-testid="notes" maxCount={250} labelText={"Notes"} enableCounter={true}
                      placeholder={placeHolder}/>
        </div>
    )
};

AppointmentNotes.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    intl: PropTypes.object.isRequired
};

export default injectIntl(AppointmentNotes);

