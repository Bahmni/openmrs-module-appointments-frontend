import React, {useEffect, useState} from 'react';
import {getService} from "../../api/serviceApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import PropTypes from "prop-types";
import {forEach} from 'lodash';
import {injectIntl} from "react-intl";

const ServiceTypeSearch = props => {

    const {intl, serviceUuid, onChange, value, isDisabled} = props;
    const placeHolder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_SERVICE_APP_TYPE', defaultMessage: 'Service App Type'
    });
    const [isServiceNotSelected, setIsServiceNotSelected] = useState(true);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        setSelectedOption(null);
        if (serviceUuid) {
            setServiceTypes(getServiceType(serviceUuid));
            setIsServiceNotSelected(false);
        } else {
            setIsServiceNotSelected(true);
        }
    }, [serviceUuid]);


    const getServiceType = async (serviceUuid) => {
        const service = await getService(serviceUuid);
        const serviceTypes = service.serviceTypes;
        if(serviceTypes && serviceTypes.length === 0) {
            setIsServiceNotSelected(true);
        }
        else {
            setServiceTypes(createDropdownOptions(serviceTypes));
        }
    };

    const createDropdownOptions = (results) => {
        const options = [];
        forEach(results, function (serviceType) {
            options.push({
                value: serviceType,
                label: `${serviceType.name} [${serviceType.duration} min]`
            })
        });
        return options;
    };

    const updateSelection = option => {
        setSelectedOption(option);
        onChange(option);
    };

    return (
        <div>
            <Dropdown
                isDisabled={isServiceNotSelected || isDisabled}
                options={Object.values(serviceTypes)}
                placeholder={placeHolder}
                value={selectedOption}
                onChange={updateSelection}
                selectedValue={value}
                isClearable={true}
            />
        </div>
    );
};

ServiceTypeSearch.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    serviceUuid: PropTypes.string,
    value:PropTypes.object,
    isDisabled: PropTypes.bool
};

export default injectIntl(ServiceTypeSearch);
