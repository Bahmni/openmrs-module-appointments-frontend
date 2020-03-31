import { getAllProviders } from "../../api/providerApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import React, { useEffect, useState } from "react";
import Tags from "../Tags/Tags.jsx";
import { forEach, find } from "lodash";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import { sortBy } from "lodash";
import { getValidProviders } from "../../helper";
import { PROVIDER_RESPONSES } from "../../constants";

const providerList = [
  { value: "Scheduled", label: "Scheduled" },
  { value: "CheckedIn", label: "CheckedIn" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Missed", label: "Missed" }
];

const ProviderSearch = props => {
  const {
    intl,
    selectedProviders,
    onChange = (e)=> onChangeHandler(e) ,
    onProviderRemove = (e) => onRemoveProvider(e) ,
    isDisabled
  } = props;
  const {
    openMenuOnClick = true,
    openMenuOnFocus = true,
    style = "",
    components
  } = props;

  const placeHolder = intl.formatMessage({
    id: "PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PROVIDER",
    defaultMessage: "Choose Provider"
  });
  const [providers, setProviders] = useState(providerList);   //loadProviders()
  const [selectedProvider, setSelectedProvider] = useState([]);

  useEffect(() => {
      if(props.onChange)
        setProviders(loadProviders());

  }, [selectedProvider]);

  const loadProviders = async () => {
    const providers = await getAllProviders();
    console.log("providers", providers);
    setProviders(createDropdownOptions(providers));
  };

  const createDropdownOptions = results => {
    const options = [];
    forEach(results, provider =>
      options.push({
        value: provider.uuid,
        label: provider.person.display,
        comments: null,
        response: PROVIDER_RESPONSES.ACCEPTED
      })
    );
    return sortBy(options, providerOption =>
      providerOption.label.toLowerCase()
    );
  };

  const onProviderSelect = selectedProviderOption => {
    setSelectedProvider(null);
    const selectedProviderObj = find(providers, [
      "value",
      selectedProviderOption.value
    ]);
    onChange(selectedProviderObj);
  };

  const onChangeHandler = e => {
      console.log(e)
    setSelectedProvider([...selectedProvider, e]);
    let someAfr = [...providers].filter(item => {return item.value != e.value
    });
    setProviders(someAfr);
    console.log('onchangehandler',providers)
  };

  const onRemoveProvider = e => {
      console.log(e)
    setSelectedProvider(() =>
      [...selectedProvider].filter(item => item.value !== e)
    );
    setProviders([...providers, { value: e, label: e }]);
    console.log('onremovehandler',providers)

  };

  return (
    <div>
      <Dropdown
        isDisabled={isDisabled}
        options={providers}
        placeholder={placeHolder}
        onChange={props.onChange?onProviderSelect:onChange}
        selectedValue={""}
        openMenuOnClick={openMenuOnClick}
        openMenuOnFocus={openMenuOnFocus}
        components={components}
      />
      <Tags
        onChange={onProviderRemove}
        isDisabled={isDisabled}
        selectedTags={props.onChange?getValidProviders(selectedProviders):selectedProvider}
        style={style}
      />
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
