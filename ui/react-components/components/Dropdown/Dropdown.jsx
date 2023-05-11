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
    return data.item.label.toLowerCase().includes(data.inputValue.toLowerCase());
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
    setValue(selected.selectedItem || {label: ""} )
    onChange(selected.selectedItem)
  }
  useEffect(()=>{
    setValue(selectedValue)
  }, [selectedValue])
  const isComponentDisabled = () =>
    isUndefined(isDisabled) ? false : isDisabled;
  return (
    <div
      data-testid="select"
      className={classNames(isComponentDisabled() ? disable : "")}
    >
      <ComboBox
          id={"combo-box"}
          ref={dropdownRef}
          items={options}
          onChange={handleOnChange}
          itemToString={(item) => (item ? item.label : '')}
          titleText={placeholder}
          disabled={isDisabled}
          shouldFilterItem={filterItems}
          placeholder={"Choose an option"}
          value={value? value.label: undefined}
          style={{ width: '240px' }}
          selectedItem={value}
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
