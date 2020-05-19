import React from "react";
import Label from "../Label/Label";
import ProviderSearch from "../Provider/ProviderSearch";
import LocationSearch from "../Location/LocationSearch";
import AppointmentStatus from "../AppointmentStatus/AppointmentStatus";
import classNames from "classnames";
import {appointmentFilterItems} from "./FilterWrapper.module.scss";

const customSelectStyle={
  option: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "white" : "black",
    backgroundColor: state.isFocused ? "#0097cf" : "white",
  }),
}
const customSelectComponents={
  IndicatorSeparator: () => null,
  DropdownIndicator: () => null
}

const FilterWrapper = props => {
  return (
    <div>
      <div className={classNames(appointmentFilterItems)}>
        <Label translationKey="PROVIDER_FILTER" defaultValue="Provider" />
        <ProviderSearch
          openMenuOnClick={false}
          openMenuOnFocus={false}
          style={"custom"}
          components={customSelectComponents}
          customSelectStyle={customSelectStyle}
        />
      </div>
      <div className={classNames(appointmentFilterItems)}>
        <Label translationKey="LOCATION_FILTER" defaultValue="Location" />
        <LocationSearch
          showTags={true}
          openMenuOnClick={false}
          openMenuOnFocus={false}
          style={"custom"}
          components={customSelectComponents}
          customSelectStyle={customSelectStyle}
        />
      </div>
      <div className={classNames(appointmentFilterItems)}>
        <Label
          translationKey="APPOINTMENT_STATUS_FILTER"
          defaultValue="Appointment Status"
        />
        <AppointmentStatus
          openMenuOnClick={false}
          openMenuOnFocus={false}
          style={"custom"}
          components={customSelectComponents}
          customSelectStyle={customSelectStyle}
        />
      </div>
    </div>
  );
};

export default FilterWrapper;
