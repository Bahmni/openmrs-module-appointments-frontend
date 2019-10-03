import React, { Component } from 'react';
import {getPatientsByLocation} from '../../api/patientApi';
import {currentLocation} from '../../utils/CookieUtil';
import Dropdown from "../Dropdown/Dropdown.jsx";

export default class PatientSearch extends Component {
    constructor (props) {
        super(props);
        this.loadPatients = this.loadPatients.bind(this);
    }

    async loadPatients (searchString) {
        if (searchString.length < 3) {
            return [];
        } else {
            const patients = await getPatientsByLocation(currentLocation().uuid, searchString);
            return this.createDropdownOptions(patients);
        }
    }

    createDropdownOptions (patients) {
        return patients.map(patient => {
            const givenName = patient.givenName ? patient.givenName : '';
            const familyName = patient.familyName ? patient.familyName : '';
            return {
                value: patient,
                label: `${givenName} ${familyName} (${patient.identifier})`};
        });
    }

    render () {
        return (
            <Dropdown
                loadOptions={this.loadPatients}
            />);
    }
}
