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
        const defaultOption = intl.formatMessage({id: 'PLACEHOLDER_SPECIALITY', defaultMessage: 'Select a speciality'});
        const options = [{value: null, label: defaultOption}];
        forEach(specialities, function (speciality) {
            options.push({
                value: speciality.uuid,
                label: speciality.name
            });
        });
        return options;
    };

    const loadSpecialities = async () => {
        const specialities = await getAllSpecialities();
        setSpecialities(createDropdownOptions(specialities));
    };

    const {intl, onChange} = props;
    const placeholder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_SPECIALITY', defaultMessage: 'Speciality'
    });

    return (
        <Dropdown
            options={Object.values(specialities)}
            onChange={onChange}
            placeholder={placeholder}
        />);
};

SpecialitySearch.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default injectIntl(SpecialitySearch);
