import React, {useState, useEffect} from "react";
import AsyncSelect from "react-select/async";
import {dropdownIndicator, resetSelectContainer, searchIcon, disable} from './Dropdown.module.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {injectIntl} from "react-intl";
import {DropdownIndicator} from "./DropdownIndicator.jsx";
import {IndicatorSeparator} from "./IndicatorSeparator.jsx";
import {ValueContainer} from "./ValueContainer.jsx";
import {isUndefined} from "lodash";

const AsyncDropdown = (props) => {

    const {loadOptions, placeholder, onChange, intl, selectedValue, isDisabled, autoFocus} = props;

    const [inputValue, setInputValue] = useState();
    const [value, setValue] = useState(selectedValue);
    const [lastSelectedValue, setLastSelectedValue] = useState('');

    let select;
    const noOptionsMessage = intl.formatMessage({id: 'DROPDOWN_TYPE_TO_SEARCH_MESSAGE', defaultMessage: 'Type to search'});
    const loadingMessage = intl.formatMessage({id: 'DROPDOWN_LOADING_MESSAGE', defaultMessage: 'Loading...'});

    useEffect(() => {
        setValue(selectedValue);
    }, [selectedValue]);

    const handleOnChange = (event) => {
        setInputValue('');
        setValue(event);
        setLastSelectedValue(event);
        if (event) {
        } else {
            setValue('');
        }
        onChange && onChange(event);
    };
    const handleOnInputChange = (event, {action}) => {
        if (action === 'input-change') {
            setInputValue(event);
            if (!event) {
                setValue(event);
            }
            if (lastSelectedValue && onChange) {
                lastSelectedValue.label === event ? onChange(lastSelectedValue) : onChange(undefined);
            }
        }
    };
    const handleFocus = () => {
        setInputValue(inputValue !== '' ? inputValue : value && value.label);
    };

    const isComponentDisabled = () => isUndefined(isDisabled) ? false :  isDisabled;

    return (
        <div data-testid="asyncSelect" className={classNames(isComponentDisabled() ? disable : '')}>
            <AsyncSelect
                ref={ref => {
                    select = ref;
                }}
                cacheOptions={true}
                autoFocus={!isDisabled && autoFocus}
                defaultOptions
                className={classNames(resetSelectContainer, 'react-select-container')}
                classNamePrefix="react-select"
                components={{IndicatorSeparator, ValueContainer, DropdownIndicator:() => null}}
                loadOptions={loadOptions}
                noOptionsMessage={() => noOptionsMessage}
                onChange={handleOnChange}
                placeholder={placeholder}
                onInputChange={handleOnInputChange}
                defaultInputValue={inputValue}
                inputValue={inputValue}
                onFocus={handleFocus}
                isClearable
                blurInputOnSelect={true}
                value={value}
                loadingMessage={() => loadingMessage}
                onMenuOpen={() => undefined}
                openMenuOnClick={false}
                isDisabled={isComponentDisabled()}
            />
        </div>
    );
};

export default injectIntl(AsyncDropdown);

AsyncDropdown.propTypes = {
    loadOptions: PropTypes.func,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    selectedValue: PropTypes.object,
    isDisabled: PropTypes.bool,
    autoFocus: PropTypes.bool
};
