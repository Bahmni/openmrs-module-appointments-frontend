import {getAllProviders} from "../../api/providerApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import React, {useEffect, useState} from "react";
import Tags from "./Tags.jsx";
import {forEach, find, includes, filter} from 'lodash';
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";


const ProviderSearch = props => {

    const {intl, onChange} = props;
    const placeHolder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PROVIDER', defaultMessage: 'Choose Provider'
    });
    const [selectedProviders, setSelectedProviders] = useState([]);
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState();

    useEffect(() => {
        setProviders(loadProviders())
    }, []);

    const loadProviders = async () => {
        const providers = await getAllProviders();
        setProviders(createDropdownOptions(providers));
    };

    const createDropdownOptions = (results) => {
        const options = [];
        forEach(results, function (provider, index) {
            options.push({
                id: (index + 1).toString(),
                value: provider.uuid,
                label: provider.person.display,
                comments: null,
                response: "ACCEPTED"
            })
        });
        return options;
    };

    const onProviderSelect = selectedProviderOption => {
        const selectedProvider = find(providers, ["value", selectedProviderOption.value]);
        const updatedProviders = includes(selectedProviders, selectedProvider)
            ? selectedProviders
            : [...selectedProviders, selectedProvider];
        setSelectedProviders(updatedProviders);
        onChange(selectedProviders);
        setSelectedProvider(null);
    };

    const onProviderRemove = selectedProviderIdentifier => {
        setSelectedProviders(filter(selectedProviders, provider => provider.id !== selectedProviderIdentifier));
    };

    return (
        <div>
            <Dropdown
                options={Object.values(providers)}
                placeholder={placeHolder}
                onChange={onProviderSelect}
                value={selectedProvider}
            />
            <Tags selectedTags={selectedProviders} onChange={onProviderRemove}/>
        </div>
    );
};

ProviderSearch.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default injectIntl(ProviderSearch);

