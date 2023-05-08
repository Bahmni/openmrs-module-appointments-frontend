import {
  disable,
} from "./Dropdown.module.scss";
import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { PropTypes } from "prop-types";
import { DropdownIndicator } from "./DropdownIndicator.jsx";
import { ValueContainer } from "./ValueContainer.jsx";
import { IndicatorSeparator } from "./IndicatorSeparator.jsx";
import { injectIntl } from "react-intl";
import { isUndefined } from "lodash";
import {ComboBox} from "carbon-components-react";
import 'carbon-components/css/carbon-components.min.css';

const Dropdown = (props) => {
  const {
    options,
    placeholder,
    onChange,
    isDisabled,
    intl,
    selectedValue,
    isClearable,
    autoFocus,
    id,
  } = props;
  const noOptionsMessage = intl.formatMessage({
    id: "DROPDOWN_NO_OPTIONS_MESSAGE",
    defaultMessage: "No Options",
  });
  const [value, setValue] = useState(selectedValue);

  const filterItems = data => {
    return data.item.label.includes(data.inputValue);
  }
  const {
    openMenuOnClick = true,
    openMenuOnFocus = true,
    components = { IndicatorSeparator, ValueContainer, DropdownIndicator },
    customSelectStyle,
  } = props;
  const dropdownRef = useRef(null);
  useEffect(() => {
    autoFocus && dropdownRef && !isDisabled && dropdownRef.current.focus();
  }, [autoFocus, isDisabled]);

  const handleOnChange = (selected) => {
    onChange(selected.selectedItem)
  }
  const isComponentDisabled = () =>
    isUndefined(isDisabled) ? false : isDisabled;
  console.log('selectedValue', selectedValue);
  return (
    <div
      data-testid="select"
      className={classNames(isComponentDisabled() ? disable : "")}
    >
      {/*<Select*/}
      {/*  ref={dropdownRef}*/}
      {/*  className={classNames(openMenuOnClick ? resetSelectContainer : "")} //based on parent props*/}
      {/*  classNamePrefix="react-select"*/}
      {/*  components={components} //Handle search icon and down-icon from different parents*/}
      {/*  options={options}*/}
      {/*  noOptionsMessage={() => noOptionsMessage}*/}
      {/*  placeholder={placeholder}*/}
      {/*  onChange={onChange}*/}
      {/*  isDisabled={isDisabled}*/}
      {/*  value={selectedValue}*/}
      {/*  isClearable={isClearable}*/}
      {/*  // openMenuOnClick={openMenuOnClick} //need to get from props for different behaviour with dropdown as it open onClcik for AddAppointment component*/}
      {/*  // openMenuOnFocus={openMenuOnFocus}*/}
      {/*  styles={customSelectStyle}*/}
      {/*/>*/}
      <ComboBox
          id={id}
          ref={dropdownRef}
          items={options}
          onChange={handleOnChange}
          itemToString={(item) => (item ? item.label : '')}
          placeholder={placeholder}
          disabled={isDisabled}
          shouldFilterItem={filterItems}
          value={selectedValue? selectedValue.label: undefined}
      />
    </div>
  );
};

export default injectIntl(Dropdown);

Dropdown.propTypes = {
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  selectedValue: PropTypes.string,
  isDisabled: PropTypes.bool,
  isClearable: PropTypes.bool,
  autoFocus: PropTypes.bool,
};
