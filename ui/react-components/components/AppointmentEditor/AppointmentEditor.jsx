import React, {Fragment, useState} from "react";
import classNames from 'classnames';
import {
    appointmenteditor,
    searchFieldsContainer,
    searchFieldsContainerLeft,
    searchFieldsContainerRight
} from './AppointmentEditor.module.scss';
import PatientSearch from "../PatientSearch/PatientSearch.jsx";
import ServiceSearch from "../Service/ServiceSearch.jsx";
import ServiceTypeSearch from "../Service/ServiceTypeSearch.jsx";
import ProviderSearch from "../Provider/ProviderSearch.jsx";
import LocationSearch from "../Location/LocationSearch.jsx";
import SpecialitySearch from "../Speciality/SpecialitySearch.jsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.jsx";
import AppointmentEditorFooter from "../AppointmentEditorFooter/AppointmentEditorFooter.jsx";
import {saveAppointment} from "../../api/appointmentsApi";
import PropTypes from "prop-types";
import AppointmentDatePicker from "../DatePicker/DatePicker.jsx";
import Label from '../Label/Label.jsx';


export const AppointmentEditor = props => {
    const [patient, setPatient] = useState();
    const [providers, setProviders] = useState([]);
    const [service, setService] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [location, setLocation] = useState('');
    const [speciality, setSpeciality] = useState('');
    const [startDate, setStartDate] = useState();
    const {appConfig} = props;

    const isSpecialitiesEnabled = () => {
        if (appConfig)
            return appConfig.enableSpecialities;
        return false;
    };

    const getPayload = () => {
        return {
            patientUuid: patient.uuid,
            serviceUuid: service,
            serviceTypeUuid: serviceType,
            startDateTime: "2019-10-11T04:30:00.000Z",
            endDateTime: "2019-10-10T05:00:00.000Z",
            providers: getFormattedProviders(providers),
            locationUuid: location,
            appointmentKind: "Scheduled"
        };
    };

    const getFormattedProviders = providers => providers.map(provider => {
        provider.name = provider.label;
        provider.uuid = provider.value;
        delete provider.label;
        delete provider.value;
        return provider;
    });

    const checkAndSave = async () => {
        const payload = getPayload();
        await saveAppointment(payload);
    };

    return (<Fragment>
        <div data-testid="appointment-editor" className={classNames(appointmenteditor)}>
            <div className={classNames(searchFieldsContainer)}>
                <div className={classNames(searchFieldsContainerLeft)}>
                    <div>
                        <PatientSearch onChange={(optionSelected) => setPatient(optionSelected.value)}/>
                    </div>
                    <div>
                        <ServiceSearch onChange={(optionSelected) => setService(optionSelected.value)}
                                       specialityUuid={speciality}
                        />
                        <ErrorMessage/>
                    </div>
                    <div>
                        <ServiceTypeSearch onChange={(optionSelected) => setServiceType(optionSelected.value)}
                                           serviceUuid={service}/>
                    </div>
                    {isSpecialitiesEnabled() ?
                        <div>
                            <SpecialitySearch onChange={(optionSelected) => setSpeciality(optionSelected.value)}/>
                        </div> : null
                    }
                    <div>
                        <LocationSearch onChange={(optionSelected) => setLocation(optionSelected.value)}/>
                    </div>
                </div>
                <div className={classNames(searchFieldsContainerRight)}>
                    <ProviderSearch onChange={selectedProviders => setProviders(selectedProviders)}/>
                </div>
            </div>
            <div className={classNames(searchFieldsContainer)}>
                <div className={classNames(searchFieldsContainerLeft)}>
                    <div>
                        <Label translationKey='APPOINTMENT_DATE_LABEL' defaultValue='Appointment date' /> 
                        <AppointmentDatePicker onChange={date => setStartDate(date)} />
                    </div>
                </div>
            </div>
            <AppointmentEditorFooter checkAndSave={checkAndSave}/>
        </div>
    </Fragment>);
};

AppointmentEditor.propTypes = {
    appConfigs: PropTypes.object
};
