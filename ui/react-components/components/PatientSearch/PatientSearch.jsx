import React from 'react';
import {getPatientForDropdown, getPatientName} from "../../mapper/patientMapper";
import {getPatientsByLocation} from '../../api/patientApi';
import {currentLocation} from '../../utils/CookieUtil';
import AsyncDropdown from "../Dropdown/AsyncDropdown.jsx";
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {MINIMUM_CHAR_LENGTH_FOR_PATIENT_SEARCH} from "../../constants";

const PatientSearch = (props) => {

    const {intl, onChange, value, isDisabled, minCharLengthToTriggerPatientSearch} = props;

    const createDropdownOptions = (patients) => {
        return patients.map(patient => getPatientForDropdown(patient));
    };

    const loadPatients = async (searchString) => {
        const minCharLength = minCharLengthToTriggerPatientSearch || MINIMUM_CHAR_LENGTH_FOR_PATIENT_SEARCH;
        if (searchString.length < minCharLength) {
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
            isDisabled={isDisabled}
        />);
};

PatientSearch.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object,
    isDisabled: PropTypes.bool,
    minCharLengthToTriggerPatientSearch: PropTypes.number
};

export default injectIntl(PatientSearch);
