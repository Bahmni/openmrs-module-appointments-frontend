import React, {useState, useEffect} from 'react';
import {getPatientForDropdown, getPatientName} from "../../mapper/patientMapper";
import {getPatientsByLocation} from '../../api/patientApi';
import {currentLocation} from '../../utils/CookieUtil';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {MINIMUM_CHAR_LENGTH_FOR_PATIENT_SEARCH} from "../../constants";
import {Search, ClickableTile, Tile} from "carbon-components-react";
import 'carbon-components/css/carbon-components.min.css';

const styles = {
    patientSearch : {
        "z-index": "100",
        "position": "absolute",
        "width": "505px",
        "max-height": "250px",
        "overflow": "auto"
      },
      patientSearchDropdown : {
        "border-bottom": "solid #8D8D8D",
        "min-height": "unset"
      }
}
const PatientSearch = (props) => {

    const {intl, onChange, value, isDisabled, minCharLengthToTriggerPatientSearch, autoFocus} = props;
    const [userInput, setUserInput] = useState('')
    const [patients, setPatients] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null)
    const createDropdownOptions = (patients) => {
        return patients.map(patient => getPatientForDropdown(patient));
    };

    const loadPatients = async (searchString) => {
        const minCharLength = minCharLengthToTriggerPatientSearch || MINIMUM_CHAR_LENGTH_FOR_PATIENT_SEARCH;
        if (searchString.length < minCharLength) {
            setPatients([]);
        } else {
            const patients = await getPatientsByLocation(currentLocation().uuid, searchString);
            setPatients(createDropdownOptions(patients));
        }
    };

    useEffect(() => {
        if (userInput.length > 1) {
            loadPatients(userInput);
        }
        setSelectedPatient(null);
    }, [userInput])

    const showPatients = () => {
        if(patients.length !=0 ) {
            return patients.map((patient) => (
                <ClickableTile style={styles.patientSearchDropdown}
                  key={patient.value}
                  onClick={() => {
                      setSelectedPatient(patient);
                      onChange && onChange(patient);
                  }}
                >
                  {patient.label}
                </ClickableTile>
              ));
        } else {
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
                data-testid="Search Patient"
                labelText="SearchPatients"
                placeholder={placeholder}
                onChange={(e) =>
                    setUserInput(e.target.value)
                }
                onClear={() => setUserInput('')}
                disabled={isDisabled}
                value={value ? value.label : selectedPatient ? selectedPatient.label : userInput}
            />
            {patients && !selectedPatient && userInput.length >= 2 && (
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
