import React, {useEffect, useState} from 'react';
import {searchConcepts} from "../../api/conceptApi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import Tags from "../Tags/Tags.jsx";
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import {API_DEBOUNCE_DELAY_IN_MS, MINIMUM_CHAR_LENGTH_FOR_PATIENT_SEARCH} from "../../constants";
import {find} from 'lodash';
import {reasonTagsContainer, fullWidthDropdown} from "./AppointmentReasonSearch.module.scss";
import classNames from "classnames";
import {getAppointmentReasonConceptSet} from "../../helper";

const AppointmentReasonSearch = (props) => {

    const {
        intl, 
        onChange, 
        selectedReasons = [],
        onReasonRemove,
        isDisabled, 
        isRequired, 
        autoFocus,
        appConfig
    } = props;

    const placeHolder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_REASON_SEARCH', defaultMessage: 'Appointment Reason'
    });
    
    const minCharsMessage = intl.formatMessage({
        id: 'APPOINTMENT_REASON_SEARCH_MIN_CHARS_MESSAGE', 
        defaultMessage: 'Type 3 chars to search'
    });
    
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const delayTimer = setTimeout(() => {
            if (searchTerm.length >= MINIMUM_CHAR_LENGTH_FOR_PATIENT_SEARCH) {
                loadConcepts(searchTerm).then();
            } else {
                setDropdownOptions([]);
            }
        }, API_DEBOUNCE_DELAY_IN_MS);

        return () => clearTimeout(delayTimer);
    }, [searchTerm]);

    const loadConcepts = async (term) => {
        try {
            const appointmentReasonConceptSet = getAppointmentReasonConceptSet(appConfig);
            const results = await searchConcepts(appointmentReasonConceptSet, term);
            const options = createDropdownOptions(results);
            const filteredOptions = options.filter(option =>
                !selectedReasons.find(selected => selected.value === option.value)
            );
            setDropdownOptions(filteredOptions);
        } catch (error) {
            console.error('Error loading concepts:', error);
            setDropdownOptions([]);
        }
    };

    const createDropdownOptions = (results) => {
        return results.map(concept => ({
            value: concept.uuid,
            label: concept.display
        }));
    };

    const onReasonSelect = (selectedReasonOption) => {
        if (selectedReasonOption !== null) {
            const selectedReasonObj = find(dropdownOptions, [
                "value",
                selectedReasonOption.value
            ]);
            if (selectedReasonObj) {
                onChange(selectedReasonObj);
                setDropdownOptions(dropdownOptions.filter(opt => opt.value !== selectedReasonOption.value));
            }
        }
    };

    return (
        <div>
            <div className={fullWidthDropdown}>
                <Dropdown 
                    data-testid="appointment-reason-search"
                    options={dropdownOptions}
                    placeholder={placeHolder}
                    onChange={onReasonSelect}
                    isDisabled={isDisabled}
                    isRequired={isRequired}
                    isClearable={false}
                    autoFocus={autoFocus}
                    onInputChange={setSearchTerm}
                    placeHolderMessage={minCharsMessage}
                />
            </div>
            <div className={classNames(reasonTagsContainer)}>
                <Tags
                    onChange={onReasonRemove}
                    isDisabled={isDisabled}
                    selectedTags={selectedReasons}
                />
            </div>
        </div>
    );
};

AppointmentReasonSearch.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onReasonRemove: PropTypes.func,
    selectedReasons: PropTypes.array,
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
    autoFocus: PropTypes.bool,
    appConfig: PropTypes.object
};

export default injectIntl(AppointmentReasonSearch);
