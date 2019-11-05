import Select from "react-select";
import {dropdownIndicator, resetSelectContainer, searchIcon} from './Dropdown.module.scss';
import React, {useEffect, useState} from "react";
import classNames from 'classnames';
import {PropTypes} from 'prop-types';
import {DropdownIndicator} from "./DropdownIndicator.jsx";
import {ValueContainer} from "./ValueContainer.jsx";
import {IndicatorSeparator} from "./IndicatorSeparator.jsx";
import {injectIntl} from "react-intl";

const Dropdown = props => {
    const {options, placeholder, onChange, isDisabled, intl, selectedValue} = props;
    const noOptionsMessage = intl.formatMessage({id: 'DROPDOWN_NO_OPTIONS_MESSAGE', defaultMessage: 'No Options'});

    const [value, setValue] = useState(selectedValue);
    useEffect(() => {
        if (selectedValue) {
            setValue(selectedValue);
            onChange(selectedValue);
        }
    },[selectedValue]);

    return (
        <div data-testid="select">
            <Select
                className={classNames(resetSelectContainer, 'react-select-container')}
                classNamePrefix="react-select"
                components={{IndicatorSeparator, ValueContainer, DropdownIndicator}}
                options={options}
                noOptionsMessage={() => noOptionsMessage}
                placeholder={placeholder}
                onChange={onChange}
                isDisabled={isDisabled}
                value={value}
            />
        </div>
    );
};

export default injectIntl(Dropdown);

Dropdown.propTypes = {
    options: PropTypes.array,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    selectedValue: PropTypes.object
};
