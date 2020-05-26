import { getAllProviders } from "../../api/providerApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import React, { useEffect, useState } from "react";
import Tags from "../Tags/Tags.jsx";
import { forEach, find } from "lodash";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import { sortBy } from "lodash";
import { getValidProviders } from "../../helper";
import { PROVIDER_RESPONSES,availableForAppointments } from "../../constants";
import {
  searchFieldOnChangeHandler,
  searchFieldOnRemoveHandler
} from "../../helper";

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
    customSelectStyle
  } = props;

  const placeHolder = intl.formatMessage({
    id: "PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PROVIDER",
    defaultMessage: "Choose Provider"
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
        options.push({
          value: provider.uuid,
          label: provider.person.display,
          comments: null,
          response: PROVIDER_RESPONSES.ACCEPTED
        });
      }
    });
    return sortBy(options, providerOption =>
      providerOption.label.toLowerCase()
    )
  };

  const [providers, setProviders] = useState([])
  const [selectedProvider, setSelectedProvider] = useState([]);

  useEffect(() => {
    loadProviders().then((providers) => {
      setProviders(providers)
    })
  }, []);

  const loadProviders = async () => {
    let providers = await getAllProviders();
    if(providers.length===undefined){
      return []
    }
    return createDropdownOptions(providers)
  };

  const onProviderSelect = selectedProviderOption => {
    setSelectedProvider(null);
    const selectedProviderObj = find(providers, [
      "value",
      selectedProviderOption.value
    ]);
    onChange(selectedProviderObj);
  };

  const onChangeHandler = e =>
    searchFieldOnChangeHandler(
      providers,
      setProviders,
      selectedProvider,
      setSelectedProvider,
      e
    );
  const onRemoveHandler = e =>
    searchFieldOnRemoveHandler(
      providers,
      setProviders,
      selectedProvider,
      setSelectedProvider,
      e
    );

  return (
    <div>
      <Dropdown
        isDisabled={isDisabled}
        options={providers}
        placeholder={placeHolder}
        onChange={onChange ? onProviderSelect : onChangeHandler}
        selectedValue={""}
        openMenuOnClick={openMenuOnClick}
        openMenuOnFocus={openMenuOnFocus}
        components={components}
        customSelectStyle={customSelectStyle}
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
  isDisabled: PropTypes.bool
};

export default injectIntl(ProviderSearch);
