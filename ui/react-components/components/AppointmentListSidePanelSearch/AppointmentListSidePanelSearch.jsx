import React from "react";
import "./AppointmentListSidePanelSearch.module.scss";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
const AppointmentListSidePanelSearch = props => {
  const {
    value,
    onChange,
    placeholder = "Search..",
    style = "appointmentListSidePanelSearch",
    disabledInputSearch,
    onClearText,
    intl
  } = props;

  return (
    <div className="searchContainer">
      <input
        type="text"
        placeholder={placeholder}
        value={value === null ? "" : value}
        onChange={onChange}
        disabled={disabledInputSearch}
        className={`${style} ${disabledInputSearch ? "disabled" : ""}`}
      />
      <button
        className="icon"
        disabled={disabledInputSearch}
        onClick={onClearText}
      >
        {value == null || "" ? (
          <i className="fa fa-search " data-testid="search"></i>
        ) : (
          <i
            className={`fa fa-times ${
              disabledInputSearch ? "fa-times-disabled" : ""
            }`}
            data-testid="times"
          ></i>
        )}
      </button>
    </div>
  );
};

AppointmentListSidePanelSearch.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(AppointmentListSidePanelSearch);
