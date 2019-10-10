import React, {useEffect, useState} from 'react';
import {getService} from "../../api/serviceApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import PropTypes from "prop-types";
import {forEach} from 'lodash';

const ServiceTypeSearch = props => {

    const {serviceUuid, onChange} = props;
    const [placeHolder] = useState("Service App Type");
    const [disabled, setDisabled] = useState(true);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        setSelectedOption(null);
        if (serviceUuid) {
            setServiceTypes(getServiceType(serviceUuid));
            setDisabled(false);
        }
    }, [serviceUuid]);

    const getServiceType = async (serviceUuid) => {
        const service = await getService(serviceUuid);
        const serviceTypes = service.serviceTypes;
        setServiceTypes(createDropdownOptions(serviceTypes));
    };

    const createDropdownOptions = (results) => {
        const options = [];
        forEach(results, function (serviceType) {
            options.push({
                value: serviceType.uuid,
                label: serviceType.name
            })
        });
        return options;
    };

    const updateSelection = option => {
        setSelectedOption(option);
        onChange(option.value);
    }

    return (
        <div>
            <Dropdown
                isDisabled={disabled}
                options={Object.values(serviceTypes)}
                placeholder={placeHolder}
                value={selectedOption}
                onChange={updateSelection}
            />
        </div>
    );
};

ServiceTypeSearch.propTypes = {
    serviceUuid: PropTypes.string.isRequired
};

export default ServiceTypeSearch;
