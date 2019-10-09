import React, {useEffect, useState} from 'react';
import {getService} from "../../api/serviceApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import PropTypes from "prop-types";

const ServiceTypeSearch = props => {

    const {serviceUuid} = props;
    const [placeHolder] = useState("Select a service appointment type");
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
        _.forEach(results, function (serviceType) {
            options.push({
                value: serviceType.uuid,
                label: serviceType.name
            })
        });
        return options;
    };

    return (
        <div>
            <Dropdown
                isDisabled={disabled}
                options={Object.values(serviceTypes)}
                placeholder={placeHolder}
                value={selectedOption}
                onChange={setSelectedOption}
                isMulti={true}
            />
        </div>
    );
};

ServiceTypeSearch.propTypes = {
    serviceUuid: PropTypes.string.isRequired
};

export default ServiceTypeSearch;
