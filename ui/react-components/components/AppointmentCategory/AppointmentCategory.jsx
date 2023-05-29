import React from 'react';
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import {ComboBox} from "carbon-components-react";

const AppointmentCategory = (props) => {

    const {intl, onChange, value, isDisabled, specialityEnabled, autoFocus, priorityOptionsList} = props;
    const placeHolder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_CREATE_APPOINTMENT_CATEGORY', defaultMessage: "Appointment category"
    });
    const filterItems = data => {
        return data.item.label.includes(data.inputValue);
    }

    return (
        <ComboBox id="service-search"
                  items={priorityOptionsList}
                  titleText={placeHolder}
                  placeholder={"Choose an option"}
                  onChange={onChange}
                  isDisabled={isDisabled}
                  autoFocus={!specialityEnabled && autoFocus}
                  shouldFilterItem={filterItems}
                  selectedItem={value || ""}
                  disabled={isDisabled}
        />
    );
};

AppointmentCategory.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    specialityUuid: PropTypes.string,
    value: PropTypes.object,
    isDisabled: PropTypes.bool,
    specialityEnabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    priorityOptionsList: PropTypes.array
};

export default injectIntl(AppointmentCategory);
