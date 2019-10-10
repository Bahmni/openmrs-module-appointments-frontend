import React, {useEffect, useState} from 'react';
import {getAllServices} from "../../api/serviceApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import {forEach} from 'lodash';

const ServiceSearch = (props) => {

    const [placeHolder] = useState("Service");
    const [services, setServices] = useState([]);

    useEffect(() => { setServices(loadServices()) },[]);


    const loadServices = async () => {
        const services = await getAllServices();
        setServices(createDropdownOptions(services));
    };

    const createDropdownOptions = (results) => {
        const options = [];
        forEach(results, function (service) {
            options.push({
                value: service.uuid,
                label: service.name
            })
        });
        return options;
    };

    return (
        <Dropdown
            options={Object.values(services)}
            placeholder={placeHolder}
            onChange={props.onChange}
        />
    );
};

ServiceSearch.propTypes = {
    onChange: PropTypes.func.isRequired
};

export default injectIntl(ServiceSearch);
