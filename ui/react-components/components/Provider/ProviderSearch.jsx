import { getAllProviders } from "../../api/providerApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import React, {useEffect, useState} from "react";
import Tags from "../Tags/Tags.jsx";
import {find, forEach, sortBy} from "lodash";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import {getValidProviders} from "../../helper";
import {availableForAppointments, PROVIDER_RESPONSES} from "../../constants";

const ProviderSearch = props => {
  const {
    intl,
    selectedProviders,
    onChange,
    onProviderRemove = e => onRemoveHandler(e),
    isDisabled,
    openMenuOnClick = true,
    openMenuOnFocus = true,
    style = "",
    components,
    customSelectStyle,
    autoFocus,
    isRequired
  } = props;

  const placeHolder = intl.formatMessage({
    id: "PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PROVIDER",
    defaultMessage: "Choose Provider"
  });

  const createProviderOption = provider => ({
    value: provider.uuid,
    label: provider.person.display,
    comments: null,
    response: PROVIDER_RESPONSES.ACCEPTED
  });

  const createDropdownOptions = results => {
    const options = [];
    forEach(results, provider => {
      if (
        provider.attributes.length > 0
          ? provider.attributes[0].attributeType.display ===
          availableForAppointments
          : false
      ) {
        options.push(createProviderOption(provider));
      }
    });
    return sortBy(options, providerOption =>
      providerOption.label.toLowerCase()
    )
  };

  const [allProviders, setAllProviders] = useState([])
  const [providerOptions, setProviderOptions] = useState([])
  const [selectedProvider, setSelectedProvider] = useState([]);

  useEffect(() => {
    loadProviders().then((providerOptions) => {
      setProviderOptions(providerOptions)
    })
  }, []);

  const loadProviders = async () => {
    let providers = await getAllProviders();
    if(providers.length===undefined){
      return []
    }
    setAllProviders(providers);
    return createDropdownOptions(providers)
  };

  const onProviderSelect = selectedProviderOption => {
    if(selectedProviderOption !== null){
      setSelectedProvider(null);
      const selectedProviderObj = find(providerOptions, [
        "value",
        selectedProviderOption.value
      ]);
      onChange(selectedProviderObj);
    }
  };

  const onChangeHandler = eventChangedValue => {
    setSelectedProvider([...selectedProvider, eventChangedValue]);
    setProviderOptions(() => [...providerOptions].filter(providerOption => providerOption.value !== eventChangedValue.value));
  };

  const onRemoveHandler = eventChangedValue => {
    setSelectedProvider(() => [...selectedProvider].filter(providerOption => providerOption.value !== eventChangedValue));
    setProviderOptions([...providerOptions, createProviderOption(find(allProviders, ["uuid", eventChangedValue]))]);
  };

  return (
    <div>
      <Dropdown
        isDisabled={isDisabled}
        options={providerOptions}
        placeholder={placeHolder}
        onChange={onChange ? onProviderSelect : onChangeHandler}
        openMenuOnClick={openMenuOnClick}
        openMenuOnFocus={openMenuOnFocus}
        components={components}
        customSelectStyle={customSelectStyle}
        autoFocus={autoFocus}
        isRequired={isRequired}
      />
      <Tags
        onChange={onProviderRemove}
        isDisabled={isDisabled}
        selectedTags={
          props.onChange
            ? getValidProviders(selectedProviders)
            : selectedProvider
        }
        style={style}
      />
    </div>
  );
};

ProviderSearch.propTypes = {
  intl: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onProviderRemove: PropTypes.func,
  selectedProviders: PropTypes.array,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  autoFocus: PropTypes.bool
};

export default injectIntl(ProviderSearch);
