import React, {useEffect, useState} from "react";
import {getAllSpecialities} from "../../api/specialityApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import {forEach} from 'lodash';

const SpecialitySearch = (props) => {

    const [specialities, setSpecialities] = useState([]);
    useEffect(() => {
        setSpecialities(loadSpecialities())
    }, []);

    const createDropdownOptions = (specialities) => {
        const options = [];
        forEach(specialities, function (speciality) {
            options.push({
                value: speciality,
                label: speciality.name
            });
        });
        return options;
    };

    const loadSpecialities = async () => {
        const specialities = await getAllSpecialities();
        setSpecialities(createDropdownOptions(specialities));
    };

    const {intl, onChange, value, isDisabled, autoFocus, isRequired} = props;
    const placeholder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_SPECIALITY', defaultMessage: 'Speciality'
    });

    return (
        <Dropdown
            options={Object.values(specialities)}
            onChange={onChange}
            placeholder={placeholder}
            selectedValue={value}
            isDisabled={isDisabled}
            isRequired={isRequired}
            isClearable={true}
            autoFocus={autoFocus}
        />);
};

SpecialitySearch.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object,
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
    autoFocus: PropTypes.bool
};

export default injectIntl(SpecialitySearch);
