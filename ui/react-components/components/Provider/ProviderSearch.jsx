import {getAllProviders} from "../../api/providerApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import React, {useEffect, useState} from "react";
import Tags from "./Tags.jsx";


const ProviderSearch = props => {

    const {onChange} = props;
    const [placeHolder] = useState("Choose Provider");
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
        _.forEach(results, function (provider, index) {
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
        const selectedProvider = _.find(providers, ["value", selectedProviderOption.value]);
        const updatedProviders = _.includes(selectedProviders, selectedProvider)
            ? selectedProviders
            : [...selectedProviders, selectedProvider];

        setSelectedProviders(updatedProviders);
        onChange(selectedProviders);
        setSelectedProvider(null);
    };

    const onProviderRemove = selectedProviderIdentifier => {
        setSelectedProviders(_.filter(selectedProviders, provider => provider.id !== selectedProviderIdentifier));
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


export default ProviderSearch;

