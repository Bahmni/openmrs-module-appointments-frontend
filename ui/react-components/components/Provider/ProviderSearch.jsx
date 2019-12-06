import {getAllProviders} from "../../api/providerApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import React, {useEffect, useState} from "react";
import Tags from "../Tags/Tags.jsx";
import {forEach, find} from 'lodash';
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import {sortBy} from "lodash";

const ProviderSearch = props => {

    const {intl, selectedProviders, onChange, onProviderRemove, maxAppointmentProvidersAllowed, isDisabled} = props;
    const placeHolder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PROVIDER', defaultMessage: 'Choose Provider'
    });
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);

    useEffect(() => {
        setProviders(loadProviders());
    }, [selectedProvider]);

    const loadProviders = async () => {
        const providers = await getAllProviders();
        setProviders(createDropdownOptions(providers));
    };

    const createDropdownOptions = (results) => {
        const options = [];
        forEach(results, provider =>
            options.push({
                value: provider.uuid,
                label: provider.person.display,
                comments: null,
                response: "ACCEPTED"
            })
        );
        return sortBy(options, providerOption => providerOption.label.toLowerCase());
    };

    const onProviderSelect = selectedProviderOption => {
        setSelectedProvider(null);
        if (selectedProviders.length < maxAppointmentProvidersAllowed) {
            const selectedProviderObj = find(providers, ["value", selectedProviderOption.value]);
            onChange(selectedProviderObj);
        }
    };

    return (
        <div>
            <Dropdown
                isDisabled={isDisabled}
                options={Object.values(providers)}
                placeholder={placeHolder}
                onChange={onProviderSelect}
                selectedValue={selectedProvider}
            />
            <Tags selectedTags={selectedProviders} onChange={onProviderRemove} isDisabled={isDisabled}/>
        </div>
    );
};

ProviderSearch.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onProviderRemove: PropTypes.func.isRequired,
    maxAppointmentProvidersAllowed: PropTypes.number.isRequired,
    selectedProviders: PropTypes.array,
    isDisabled: PropTypes.bool
};

export default injectIntl(ProviderSearch);

