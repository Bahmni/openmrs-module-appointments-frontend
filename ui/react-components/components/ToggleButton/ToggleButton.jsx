import React, { Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  toggleBtnCheckbox,
  toggleBtnLabel,
  toggleBtnSlider,
} from "./ToggleButton.module.scss";

const ToggleButton = (props) => {
  const {
    disabled,
    checked,
    handleToggle,
    checkedColor,
    checkedColorSlider,
  } = props;

  return (
    <Fragment>
      <input
        className={classNames(toggleBtnCheckbox)}
        type="checkbox"
        checked={checked}
        id="toggle-btn-checkbox"
        onChange={handleToggle}
        disabled={disabled}
      />
      <label
        className={classNames(toggleBtnLabel)}
        style={{ background: checked && checkedColor }}
        htmlFor="toggle-btn-checkbox"
      >
        <span
          style={{ background: checked && checkedColorSlider }}
          className={classNames(toggleBtnSlider)}
        ></span>
      </label>
    </Fragment>
  );
};

export default ToggleButton;

ToggleButton.propTypes = {
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  handleToggle: PropTypes.func,
  checkedColor: PropTypes.string,
};

ToggleButton.defaultProps = {
  checkedColorSlider: "#4CAF50",
  checkedColor: "#A5D6A7",
};
