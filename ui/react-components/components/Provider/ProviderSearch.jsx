import {getAllProviders} from "../../api/providerApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import React, {useEffect, useState} from "react";
import Tags from "../Tags/Tags.jsx";
import {forEach, find} from 'lodash';
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import {sortBy} from "lodash";
import {getValidProviders} from "../../helper";
import {PROVIDER_RESPONSES} from "../../constants";

const ProviderSearch = props => {

    const {intl, selectedProviders, onChange, onProviderRemove, isDisabled} = props;
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
                response: PROVIDER_RESPONSES.ACCEPTED
            })
        );
        return sortBy(options, providerOption => providerOption.label.toLowerCase());
    };

    const onProviderSelect = selectedProviderOption => {
        setSelectedProvider(null);
        const selectedProviderObj = find(providers, ["value", selectedProviderOption.value]);
        onChange(selectedProviderObj);
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
            <Tags onChange={onProviderRemove} isDisabled={isDisabled}
                  selectedTags={getValidProviders(selectedProviders)}/>
        </div>
    );
};

ProviderSearch.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onProviderRemove: PropTypes.func.isRequired,
    selectedProviders: PropTypes.array,
    isDisabled: PropTypes.bool
};

export default injectIntl(ProviderSearch);

