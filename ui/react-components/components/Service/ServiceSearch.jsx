import React, {useEffect, useState} from 'react';
import {getAllServices} from "../../api/serviceApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import {forEach} from 'lodash';

const ServiceSearch = (props) => {

    const {intl, onChange, specialityUuid, value, isDisabled, specialityEnabled, autoFocus, isRequired} = props;
    const placeHolder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_SERVICE', defaultMessage: 'Service'
    });
    const [services, setServices] = useState([]);
    const [dropdownOptions, setDropdownOptions] = useState([]);

    useEffect(() => { setServices(loadServices()) },[]);

    useEffect(() => {
            setDropdownOptions(createDropdownOptions(services))
            }, [specialityUuid, specialityEnabled]);


    const loadServices = async () => {
        const services = await getAllServices();
        setServices(services);
        setDropdownOptions(createDropdownOptions(services))
    };

    const createDropdownOptions = (results) => {
        const options = [];
        forEach(results, function (service) {
            if ((!specialityEnabled || !specialityUuid || (service.speciality && specialityUuid === service.speciality.uuid)))
                options.push({
                    value: service,
                    label: service.name
                })
        });
        return options;
    };
    return (
        <Dropdown data-testid="service-search"
                  options={Object.values(dropdownOptions)}
                  placeholder={placeHolder}
                  onChange={onChange}
                  selectedValue={value}
                  isDisabled={isDisabled}
                  isRequired={isRequired}
                  isClearable={false}
                  autoFocus={!specialityEnabled && autoFocus}
        />
    );
};

ServiceSearch.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    specialityUuid: PropTypes.string,
    value: PropTypes.object,
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
    specialityEnabled: PropTypes.bool,
    autoFocus: PropTypes.bool
};

export default injectIntl(ServiceSearch);
