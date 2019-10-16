import Select, {components} from "react-select";
import {dropdownIndicator, resetSelectContainer, searchIcon} from './Dropdown.module.scss';
import classNames from 'classnames';
import {PropTypes} from 'prop-types';
import React from "react";

const IndicatorSeparator = () => null;
const ValueContainer = ({children, ...props}) => {
    return (
        components.ValueContainer && (
            <components.ValueContainer {...props}>
                {!!children && (
                    <i
                        className={classNames("fa", "fa-search", searchIcon)}
                        aria-hidden="true"
                    />
                )}
                {children}{/**/}
            </components.ValueContainer>
        )
    );
};

const DropdownIndicator = () => {
    return <i className={classNames("fa", "fa-angle-down", "fa-lg", dropdownIndicator)} />;
};
const Dropdown = (props) => {
    const {options, placeholder, onChange, isDisabled, value} = props;
    return (
        <div data-testid="select">
            <Select
                className={classNames(resetSelectContainer, 'react-select-container')}
                classNamePrefix="react-select"
                components={{IndicatorSeparator, ValueContainer, DropdownIndicator}}
                options={options}
                noOptionsMessage={() => 'No Options'}
                placeholder={placeholder}
                onChange={onChange}
                isDisabled={isDisabled}
                value={value}
            />
        </div>
    );
};

export default Dropdown;

Dropdown.propTypes = {
    options: PropTypes.array,
    placeholder: PropTypes.string,
    onChange: PropTypes.func
};
