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
            return {
                value: patient,
                label: `${givenName} ${familyName} (${patient.identifier})`};
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

    const {intl} = props;
    const placeholder = intl.formatMessage({id: 'PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PATIENT'});
    return (
        <Dropdown
            loadOptions={loadPatients}
            placeholder={placeholder}
        />);
};

PatientSearch.propTypes = {
    intl: PropTypes.object.isRequired
};

export default injectIntl(PatientSearch);
