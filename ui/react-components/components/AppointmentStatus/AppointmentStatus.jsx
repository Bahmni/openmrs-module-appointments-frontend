import Dropdown from "../Dropdown/Dropdown.jsx";
import React, { useEffect, useState } from "react";
import Tags from "../Tags/Tags.jsx";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import {searchFeildOnChangeHandler,searchFeildOnRemoveHandler} from '../../helper';
import {appointmentStatusList} from '../../constants'

const AppointmentStatus = props => {
  const { intl, onChange=e=>onChangehandler(e),isDisabled } = props;
  const {
    openMenuOnClick = true,
    openMenuOnFocus = true,
    style = "",
    components,
    customSelectStyle
  } = props;

  const placeHolder = intl.formatMessage({
    id: "PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PROVIDER",
    defaultMessage: "Enter Status Name"
  });
  const [appointmentStatusOptions, setAppointStatusOptions] = useState([]);
  const [
    selectedAppointmentStatusOptions,
    setSelectedAppointmentStatusOptions
  ] = useState([]);

  useEffect(() => {
    setAppointStatusOptions(appointmentStatusList);
  }, [appointmentStatusList, setAppointStatusOptions]);

  const onChangeHandler = e => searchFeildOnChangeHandler(appointmentStatusOptions,setAppointStatusOptions,selectedAppointmentStatusOptions,setSelectedAppointmentStatusOptions,e)
  const onRemoveHandler = e => searchFeildOnRemoveHandler(appointmentStatusOptions,setAppointStatusOptions,selectedAppointmentStatusOptions,setSelectedAppointmentStatusOptions,e)

  return (
    <div>
      <Dropdown
        isDisabled={isDisabled}
        options={appointmentStatusOptions}
        placeholder={placeHolder}
        onChange={props.onChange?onChange:onChangeHandler}
        selectedValue={""}
        openMenuOnClick={openMenuOnClick}
        openMenuOnFocus={openMenuOnFocus}
        components={components}
        customSelectStyle={customSelectStyle}
      />

      <Tags
        onChange={onRemoveHandler}
        isDisabled={isDisabled}
        selectedTags={selectedAppointmentStatusOptions}
        style={style}
      />
    </div>
  );
};

AppointmentStatus.propTypes = {
  intl: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool
};

export default injectIntl(AppointmentStatus);
