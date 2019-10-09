import React, {useState, useEffect} from 'react';
import {getAllServices} from "../../api/serviceApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import PropTypes from "prop-types";

const ServiceSearch = (props) => {

    const [placeHolder] = useState("Select a service");
    const [services, setServices] = useState([]);

    useEffect(() => { setServices(loadServices()) },[]);


    const loadServices = async () => {
        const services = await getAllServices();
        setServices(createDropdownOptions(services));
    };

    const createDropdownOptions = (results) => {
        const options = [];
        _.forEach(results, function (service) {
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

export default ServiceSearch;
