import React from "react";
import "./AppointmentListSidePanelSearch.module.scss";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import classNames from "classnames";
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

  const searchClass = classNames(style, {
    disabled: disabledInputSearch
  });

  return (
    <div className={classNames("searchContainer")}>
      <input
        data-testid="appointmentSearch"
        type="text"
        placeholder={placeholder}
        value={value === null ? "" : value}
        onChange={onChange}
        disabled={disabledInputSearch}
        className={searchClass}
      />
      <button
        className={classNames("icon")}
        disabled={disabledInputSearch}
        onClick={onClearText}
      >
        {value == null || "" ? (
          <i className={classNames("fa fa-search")} data-testid="search"></i>
        ) : (
          <i
            className={classNames("fa fa-times", {
              "fa-times-disabled": disabledInputSearch
            })}
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
