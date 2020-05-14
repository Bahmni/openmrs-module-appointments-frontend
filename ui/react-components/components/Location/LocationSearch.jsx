import Dropdown from "../Dropdown/Dropdown.jsx";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {injectIntl} from 'react-intl';
import {getAllByTag} from "../../api/locationApi";
import {locationTagName} from "../../config";
import {forEach} from 'lodash';

const LocationSearch = (props) => {

    const [locations, setLocations] = useState([]);
    useEffect(() => {
        setLocations(loadLocations())
    }, []);

    const createDropdownOptions = (locations) => {
        const options = [];
        forEach(locations, function (location) {
            options.push({
                value: location,
                label: location.name
            });
        });
        return options;
    };

    const loadLocations = async () => {
        const locations = await getAllByTag(locationTagName);
        setLocations(createDropdownOptions(locations));
    };

    const {intl, onChange, value, isDisabled, autoFocus} = props;
    const placeholder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_LOCATION', defaultMessage: 'Location'
    });
    return (
        <Dropdown
            isDisabled={isDisabled}
            options={Object.values(locations)}
            onChange={onChange}
            placeholder={placeholder}
            selectedValue={value}
            isClearable={true}
            autoFocus={autoFocus}
        />);
};

LocationSearch.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object,
    isDisabled: PropTypes.bool,
    autoFocus: PropTypes.bool
};

export default injectIntl(LocationSearch);
