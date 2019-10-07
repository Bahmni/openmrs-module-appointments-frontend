import React from 'react';
import {getPatientsByLocation} from '../../api/patientApi';
import {currentLocation} from '../../utils/CookieUtil';
import Dropdown from "../Dropdown/Dropdown.jsx";
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

const PatientSearch = (props) => {
    const createDropdownOptions = (patients) => {
        return patients.map(patient => {
            const givenName = patient.givenName ? patient.givenName : '';
            const familyName = patient.familyName ? patient.familyName : '';
            const {identifier, uuid} = patient;
            const name = `${givenName} ${familyName}`;
            return {
                value: {name, identifier, uuid},
                label: `${name} (${patient.identifier})`};
        });
    };

    const loadPatients = async (searchString) => {
        if (searchString.length < 3) {
            return [];
        } else {
            const patients = await getPatientsByLocation(currentLocation().uuid, searchString);
            return createDropdownOptions(patients);
        }
    };

    const {intl, onChange} = props;
    const placeholder = intl.formatMessage({id: 'PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PATIENT', defaultMessage: 'Patient Name or ID'});
    return (
        <Dropdown
            loadOptions={loadPatients}
            onChange={onChange}
            placeholder={placeholder}
        />);
};

PatientSearch.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default injectIntl(PatientSearch);
