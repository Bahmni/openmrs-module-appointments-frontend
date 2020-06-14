import React from "react";
import {
  searchContainer,
  appointmentListSidePanelSearch,
  icon,
  faTimesDisabled,
  disabled,
} from "./AppointmentListSidePanelSearch.module.scss";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import classNames from "classnames";
const AppointmentListSidePanelSearch = (props) => {
  const {
    value,
    onChange,
    placeholder = "Search..",
    style = appointmentListSidePanelSearch,
    disabledInputSearch,
    onClearText,
    intl,
  } = props;

  const searchClass = classNames(style, {
    [disabled]: disabledInputSearch,
  });

  return (
    <div className={classNames(searchContainer)}>
      <input
        data-testid="appointmentSearch"
        type="text"
        placeholder={placeholder}
        value={value === null ? "" : value}
        onChange={onChange}
        disabled={disabledInputSearch}
        className={searchClass}
      />
      {(value == null) && (
        <button
          className={classNames(icon)}
          disabled={disabledInputSearch}
          onClick={onClearText}
        >
          <i className={classNames("fas fa-search")} data-testid="search"></i>
        </button>
      )}
      {value && (
        <button
          className={classNames(icon)}
          disabled={disabledInputSearch}
          onClick={onClearText}
        >
          <i
            className={classNames("fas fa-times", {
              [faTimesDisabled]: disabledInputSearch,
            })}
            data-testid="times"
          ></i>
        </button>
      )}
    </div>
  );
};

AppointmentListSidePanelSearch.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(AppointmentListSidePanelSearch);
