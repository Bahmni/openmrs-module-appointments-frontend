import React, {Component} from "react";
import {components} from "react-select";
import AsyncSelect from "react-select/async";
import {searchIcon, resetSelectContainer} from './Dropdown.module.scss';
import classNames from 'classnames';

const valueContainerStyles = {
    paddingLeft: '24px'
}

const controlStyles = {
    border: '0px',
    borderBottom: '1px solid #979797'
}

const IndicatorSeparator = () => null;
const ValueContainer = ({ children, ...props }) => {
    return (
        components.ValueContainer && (
            <components.ValueContainer {...props}>
                {!!children && (
                    <i
                        className={classNames("fa", "fa-search", searchIcon)}
                        aria-hidden="true"
                    />
                )}
                {children}
            </components.ValueContainer>
        )
    );
}

const styles = {
    valueContainer: base => ({
        ...base,
        ...valueContainerStyles
    }),
    control: (base, state) => ({
        ...base,
        ...controlStyles
    })
};

const Dropdown = (props) => {
    const {loadOptions} = props;

    return (
        <div data-testid="asyncSelect">
            <AsyncSelect
                loadOptions={loadOptions}
                components={{IndicatorSeparator, ValueContainer}}
                className={classNames(resetSelectContainer, 'reset-select-container')}
                classNamePrefix="react-select"
            />
        </div>
    );
}

export default Dropdown;
