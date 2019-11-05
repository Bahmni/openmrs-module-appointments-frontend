import React from 'react';
import {getPatientForDropdown, getPatientName} from "../../mapper/patientMapper";
import {getPatientsByLocation} from '../../api/patientApi';
import {currentLocation} from '../../utils/CookieUtil';
import AsyncDropdown from "../Dropdown/AsyncDropdown.jsx";
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

const PatientSearch = (props) => {

    const {intl, onChange, value} = props;

    const createDropdownOptions = (patients) => {
        return patients.map(patient => getPatientForDropdown(patient));
    };

    const loadPatients = async (searchString) => {
        if (searchString.length < 3) {
            return [];
        } else {
            const patients = await getPatientsByLocation(currentLocation().uuid, searchString);
            return createDropdownOptions(patients);
        }
    };

    const placeholder = intl.formatMessage({id: 'PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PATIENT', defaultMessage: 'Patient Name or ID'});
    return (
        <AsyncDropdown
            loadOptions={loadPatients}
            onChange={onChange}
            placeholder={placeholder}
            selectedValue={value}
        />);
};

PatientSearch.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object
};

export default injectIntl(PatientSearch);
