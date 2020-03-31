import { getAllProviders } from "../../api/providerApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import React, { useEffect, useState } from "react";
import Tags from "../Tags/Tags.jsx";
import { forEach, find } from "lodash";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import classNames from "classnames";
import { sortBy } from "lodash";
import { getValidProviders } from "../../helper";
import { PROVIDER_RESPONSES, appointmentConflictsUrl } from "../../constants";

const appointmentStatusList = [
  { value: "Scheduled", label: "Scheduled" },
  { value: "CheckedIn", label: "CheckedIn" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Missed", label: "Missed" }
];

const AppointmentStatus = props => {
  const { intl, isDisabled } = props;
  const {
    openMenuOnClick = true,
    openMenuOnFocus = true,
    style = "",
    components
  } = props;

  const placeHolder = intl.formatMessage({
    id: "PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PROVIDER",
    defaultMessage: "Enter a Appointment Status"
  });
  const [appointmentStatusOptions, setAppointStatusOptions] = useState([]);
  const [
    selectedAppointmentStatusOptions,
    setSelectedAppointmentStatusOptions
  ] = useState([]);

  useEffect(() => {
    setAppointStatusOptions(appointmentStatusList);
  }, [appointmentStatusList, setAppointStatusOptions]);

  const onChangeHandler = e => {
    setSelectedAppointmentStatusOptions([
      ...selectedAppointmentStatusOptions,
      e
    ]);
    setAppointStatusOptions(() =>
      [...appointmentStatusOptions].filter(item => item != e)
    );
  };

  const onRemoveStatus = e => {
    setSelectedAppointmentStatusOptions(() =>
      [...selectedAppointmentStatusOptions].filter(item => item.value !== e)
    );
    setAppointStatusOptions([
      ...appointmentStatusOptions,
      { value: e, label: e }
    ]);
  };

  return (
    <div>
      <Dropdown
        isDisabled={isDisabled}
        options={appointmentStatusOptions}
        placeholder={placeHolder}
        onChange={onChangeHandler}
        selectedValue={""}
        openMenuOnClick={openMenuOnClick}
        openMenuOnFocus={openMenuOnFocus}
        components={components}
      />

      <Tags
        onChange={onRemoveStatus}
        isDisabled={isDisabled}
        selectedTags={selectedAppointmentStatusOptions}
        style={style}
      />
    </div>
  );
};

AppointmentStatus.propTypes = {
  intl: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onProviderRemove: PropTypes.func.isRequired,
  selectedProviders: PropTypes.array,
  isDisabled: PropTypes.bool
};

export default injectIntl(AppointmentStatus);
