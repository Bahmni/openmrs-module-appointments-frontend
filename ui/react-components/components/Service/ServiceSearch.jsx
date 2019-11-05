import React, {useEffect, useState} from 'react';
import {getAllServices} from "../../api/serviceApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import {forEach} from 'lodash';

const ServiceSearch = (props) => {

    const {intl, onChange, specialityUuid, value} = props;
    const placeHolder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_SERVICE', defaultMessage: 'Service'
    });
    const [services, setServices] = useState([]);

    useEffect(() => { setServices(loadServices()) },[]);

    const loadServices = async () => {
        const services = await getAllServices();
        setServices(createDropdownOptions(services));

    };

    const createDropdownOptions = (results) => {
        const options = [];
        forEach(results, function (service) {
            if (!specialityUuid || specialityUuid === service.speciality.uuid)
                options.push({
                    value: service,
                    label: service.name
                })
        });
        return options;
    };

    return (
        <Dropdown data-testid="service-search"
                  options={Object.values(services)}
                  placeholder={placeHolder}
                  onChange={onChange}
                  selectedValue={value}
        />
    );
};

ServiceSearch.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    specialityUuid: PropTypes.string,
    value: PropTypes.object
};

export default injectIntl(ServiceSearch);
