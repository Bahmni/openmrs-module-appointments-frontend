import React, { useEffect, useState} from "react";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import { MINIMUM_CHAR_LENGTH_FOR_PATIENT_SEARCH } from "../../constants";
import { ComboBox } from "carbon-components-react";
import { getPatientsByLocation } from "../../api/patientApi";
import { currentLocation } from "../../utils/CookieUtil";
import { getPatientForDropdown } from "../../mapper/patientMapper";
import Title from "../Title/Title.jsx";
import axios from "axios";

export const PatientSearch = (props) => {
    const {
        intl,
        onChange,
        value,
        isDisabled,
        minCharLengthToTriggerPatientSearch = MINIMUM_CHAR_LENGTH_FOR_PATIENT_SEARCH,
        autoFocus
    } = props;
    const [items, setItems] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [cancelToken, setCancelToken] = useState(null);

    const setDisabledItems = ( translationKey, defaultMessage) => {
        setItems([{
            label: intl.formatMessage({id: translationKey, defaultMessage: defaultMessage}),
            disabled: true
        }])
    }
    const loadPatients = async (searchString) => {
        if (searchString.length >= minCharLengthToTriggerPatientSearch) {
            try{
                setIsLoading(true);
                if(cancelToken){
                    cancelToken.cancel('New Request made');
                }
                const source = axios.CancelToken.source();
                setCancelToken(source);
                const patients = await getPatientsByLocation(currentLocation().uuid, searchString, source.token);
                if (patients.length === 0) {
                    setDisabledItems('DROPDOWN_NO_OPTIONS_MESSAGE', 'No patients found');
                } else {
                    setItems(patients.map(getPatientForDropdown));
                }
            } catch (e) {
                setDisabledItems('DROPDOWN_NO_OPTIONS_MESSAGE', 'No patients found')
            }
            finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (userInput.length >= MINIMUM_CHAR_LENGTH_FOR_PATIENT_SEARCH) {
            loadPatients(userInput);
        }
    }, [userInput])

    const handleInputChange = async (searchString) => {
        setUserInput(searchString);
        if (searchString.length < 3) {
            setDisabledItems('DROPDOWN_TYPE_TO_SEARCH_MESSAGE', 'Type to search');
        } else{
            setDisabledItems('DROPDOWN_LOADING_MESSAGE', 'Loading...');
        }
    }
    useEffect(() => {
        if (isLoading) {
            setDisabledItems('DROPDOWN_LOADING_MESSAGE', 'Loading...');
        }
    }, [isLoading])
    const label = <Title
        text={intl.formatMessage({id: 'APPOINTMENT_PATIENT_SEARCH_LABEL', defaultMessage: 'Search Patient'})}
        isRequired={true}/>
    return <ComboBox
        id={"PatientSearch"}
        items={items}
        placeholder={intl.formatMessage({
            id: 'PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PATIENT',
            defaultMessage: 'Patient Name or ID'
        })}
        onChange={(e) => {
            onChange(e.selectedItem);
        }}
        size={"xl"}
        onInputChange={handleInputChange}
        disabled={isDisabled}
        autoFocus={autoFocus}
        titleText={label}
        selectedItem={value}
        data-testid={"search-patient"}
    />
}

PatientSearch.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object,
    isDisabled: PropTypes.bool,
    minCharLengthToTriggerPatientSearch: PropTypes.number,
    autoFocus: PropTypes.bool
};

export default injectIntl(PatientSearch);
