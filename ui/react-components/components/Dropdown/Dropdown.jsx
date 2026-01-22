import {
  disable,
} from "./Dropdown.module.scss";
import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import { PropTypes } from "prop-types";
import { injectIntl } from "react-intl";
import { isUndefined } from "lodash";
import {ComboBox} from "carbon-components-react";
import Title from "../Title/Title.jsx";

const Dropdown = (props) => {
  const {
    options,
    placeholder,
    onChange,
    isDisabled,
    selectedValue,
    autoFocus,
    isRequired,
    onInputChange,
    placeHolderMessage = "Choose an option",
  } = props;
  const filterItems = data => {
    return data.item.label.toLowerCase().includes(data.inputValue.toLowerCase());
  }
  const dropdownRef = useRef(null);
  useEffect(() => {
    autoFocus && dropdownRef && !isDisabled && dropdownRef.current.focus();
  }, [autoFocus, isDisabled]);

  const handleOnChange = (selected) => {
    onChange(selected.selectedItem)
  }
  
  const handleInputChange = (inputValue) => {
    if (onInputChange) {
      onInputChange(inputValue);
    }
  }
  
  const isComponentDisabled = () =>
    isUndefined(isDisabled) ? false : isDisabled;
  const title = <Title text={placeholder} isRequired={isRequired}/>;

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
          onInputChange={handleInputChange}
          itemToString={(item) => (item ? item.label : '')}
          titleText={title}
          disabled={isDisabled}
          shouldFilterItem={onInputChange ? undefined : filterItems}
          placeholder={placeHolderMessage}
          selectedItem={selectedValue}
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
  isRequired: PropTypes.bool,
  autoFocus: PropTypes.bool,
  onInputChange: PropTypes.func,
  placeHolderMessage: PropTypes.string,
};
