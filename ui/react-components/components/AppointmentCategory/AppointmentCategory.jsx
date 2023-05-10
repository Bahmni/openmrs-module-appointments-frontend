import React from 'react';
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import {ComboBox} from "carbon-components-react";
import 'carbon-components/css/carbon-components.min.css';

const AppointmentCategory = (props) => {

    const {intl, onChange, value, isDisabled, specialityEnabled, autoFocus} = props;
    const placeHolder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_CREATE_APPOINTMENT_CATEGORY', defaultMessage: "Appointment Category"
    });
    const options = [
        {value: 'Emergency', label: 'Urgent'},
        {value: 'Routine', label: 'Priority'},
        {value: 'AsNeeded', label: 'Routine'},
    ]
    const filterItems = data => {
        return data.item.label.includes(data.inputValue);
    }

    return (
        <ComboBox id="service-search"
                  items={options}
                  titleText={placeHolder}
                  placeholder={"Choose an option"}
                  onChange={onChange}
                  selectedValue={value}
                  isDisabled={isDisabled}
                  isClearable={false}
                  autoFocus={!specialityEnabled && autoFocus}
                  shouldFilterItem={filterItems}
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
    autoFocus: PropTypes.bool
};

export default injectIntl(AppointmentCategory);
