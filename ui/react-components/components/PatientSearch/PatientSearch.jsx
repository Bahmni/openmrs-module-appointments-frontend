import React, {useState, useEffect} from 'react';
import {getPatientForDropdown, getPatientName} from "../../mapper/patientMapper";
import {getPatientsByLocation} from '../../api/patientApi';
import {currentLocation} from '../../utils/CookieUtil';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {MINIMUM_CHAR_LENGTH_FOR_PATIENT_SEARCH} from "../../constants";
import {Search, ClickableTile, Tile} from "carbon-components-react";

const styles = {
    patientSearch : {
        "z-index": "100",
        "position": "absolute",
        "width": "508px",
        "box-shadow": "0 2px 6px rgba(0,0,0,0.3)",
        "max-height": "250px",
        "overflow": "auto"
      },
      patientSearchDropdown : {
          "height": "48px",
          "display": "flex",
          "align-items": "center",
          "padding": "0 1rem"
      }
}
const PatientSearch = (props) => {

    const {intl, onChange, value, isDisabled, minCharLengthToTriggerPatientSearch, autoFocus} = props;
    const [userInput, setUserInput] = useState('')
    const [patients, setPatients] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(value)
    const [isCalled, setIsCalled] = useState(false)
    const createDropdownOptions = (patients) => {
        return patients.map(patient => getPatientForDropdown(patient));
    };

    const loadPatients = async (searchString) => {
        const minCharLength = minCharLengthToTriggerPatientSearch || MINIMUM_CHAR_LENGTH_FOR_PATIENT_SEARCH;
        if (searchString.length < minCharLength) {
            setPatients([]);
        } else {
            setIsCalled(true);
            const patients = await getPatientsByLocation(currentLocation().uuid, searchString);
            setIsCalled(false);
            setPatients(createDropdownOptions(patients));
        }
    };

    useEffect(() => {
        if (userInput.length > 1) {
            loadPatients(userInput);
        }
        setSelectedPatient(null);
    }, [userInput])
    useEffect(()=>{
        setSelectedPatient(value);
    }, value)

    const showPatients = () => {
        if(userInput.length>= MINIMUM_CHAR_LENGTH_FOR_PATIENT_SEARCH && isCalled){
            return (
                <Tile style={styles.patientSearchDropdown}>{intl.formatMessage({id: 'DROPDOWN_LOADING_MESSAGE', defaultMessage: 'Loading...'})}</Tile>
            )
        }
        else if(patients.length !== 0 ) {
            return patients.map((patient) => (
                <ClickableTile style={styles.patientSearchDropdown}
                  key={patient.value}
                  onClick={() => {
                      setSelectedPatient(patient);
                      setUserInput("")
                      onChange && onChange(patient);
                  }}
                >
                  {patient.label}
                </ClickableTile>
              ));
        }
        else{
            return (
                <Tile style={styles.patientSearchDropdown}>{intl.formatMessage({id: 'DROPDOWN_TYPE_TO_SEARCH_MESSAGE', defaultMessage: 'Type to search'})}</Tile>
            );
        }
        
    }
    

    const placeholder = intl.formatMessage({id: 'PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PATIENT', defaultMessage: 'Patient Name or ID'});
    return (
        <div>
            <Search
                id="search"
                data-testid="search-patient"
                placeholder={placeholder}
                onChange={(e) =>{
                        setUserInput(e.target.value)
                    }
                }
                onClear={() => {
                    setUserInput('');
                    setSelectedPatient(undefined)
                    onChange(undefined)
                    setPatients([])
                }}
                disabled={isDisabled}
                value={selectedPatient ? selectedPatient.label : userInput}
                autoFocus={autoFocus}
            />
            {patients && !selectedPatient && userInput.length >= 1 && (
                <div style={styles.patientSearch}>{showPatients()}</div>
            )}
        </div>
        );
};

PatientSearch.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object,
    isDisabled: PropTypes.bool,
    minCharLengthToTriggerPatientSearch: PropTypes.number,
    autoFocus: PropTypes.bool
};

export default injectIntl(PatientSearch);
