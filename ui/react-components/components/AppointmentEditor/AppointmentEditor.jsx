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
import {injectIntl} from "react-intl";
import PropTypes from "prop-types";
import AppointmentDatePicker from "../DatePicker/DatePicker.jsx";
import {saveAppointment} from "./AppointmentEditorService";
import Label from '../Label/Label.jsx';
import AppointmentTimePicker from "../TimePicker/TimePicker.jsx";
import { Textarea } from 'react-inputs-validation';
import 'react-inputs-validation/lib/react-inputs-validation.min.css';

const AppointmentEditor = props => {
    const [patient, setPatient] = useState();
    const [patientError, setPatientError] = useState(false);
    const [serviceError, setServiceError] = useState(false);
    const [providers, setProviders] = useState([]);
    const [service, setService] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [location, setLocation] = useState('');
    const [speciality, setSpeciality] = useState('');
    const [startDate, setStartDate] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const {appConfig} = props;
    const [notes, setNotes] = useState();

    const {intl} = props;

    const isSpecialitiesEnabled = () => {
        if (appConfig)
            return appConfig.enableSpecialities;
        return false;
    };

    const maxAppointmentProvidersAllowed = () => {
        if (appConfig && appConfig.maxAppointmentProviders)
            return appConfig.maxAppointmentProviders;
        return 1;
    };

    const patientErrorMessage = intl.formatMessage({
        id: 'PATIENT_ERROR_MESSAGE', defaultMessage: 'Please select patient'
    });

    const serviceErrorMessage = intl.formatMessage({
        id: 'SERVICE_ERROR_MESSAGE', defaultMessage: 'Please select service'
    });

    const getAppointment = () => {
        return {
            patientUuid: patient && patient.uuid,
            serviceUuid: service,
            serviceTypeUuid: serviceType,
            startDateTime: "2019-10-11T04:30:00.000Z",
            endDateTime: "2019-10-10T05:00:00.000Z",
            providers: providers,
            locationUuid: location,
            appointmentKind: "Scheduled"
        };
    };

    const isValidAppointment = () => {
        const isValidPatient = patient && patient.uuid;
        const isValidService = !!service;
        setPatientError(!isValidPatient);
        setServiceError(!isValidService);
        return isValidPatient && isValidService;
    };

    const checkAndSave = async () => {
        const appointment = getAppointment();
        if (isValidAppointment()) {
            await saveAppointment(appointment);
        }
    };

    return (<Fragment>
        <div data-testid="appointment-editor" className={classNames(appointmenteditor)}>
            <div className={classNames(searchFieldsContainer)}>
                <div className={classNames(searchFieldsContainerLeft)}>
                    <div>
                        <PatientSearch onChange={(optionSelected) => {
                            setPatient(optionSelected.value);
                            setPatientError(!optionSelected.value);
                        }}/>
                        <ErrorMessage message={patientError ? patientErrorMessage : undefined}/>
                    </div>
                    <div>
                        <ServiceSearch onChange={(optionSelected) => {
                            setService(optionSelected.value);
                            setServiceError(!optionSelected.value)
                        }}
                                       specialityUuid={speciality}/>
                        <ErrorMessage message={serviceError ? serviceErrorMessage : undefined}/>
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
                    <ProviderSearch onChange={selectedProviders => setProviders(selectedProviders)}
                                    maxAppointmentProvidersAllowed={maxAppointmentProvidersAllowed()}/>
                </div>
            </div>
            <div className={classNames(searchFieldsContainer)}>
                <div className={classNames(searchFieldsContainerLeft)}>
                    <div>
                        <Label translationKey='APPOINTMENT_DATE_LABEL' defaultValue='Appointment date' />
                        <div style={{marginTop:'20px'}}>
                            <AppointmentDatePicker onChange={date => setStartDate(date)} />
                        </div>
                    </div>
                    <div>
                        <Label translationKey='APPOINTMENT_TIME_LABEL' defaultValue='Choose a time slot' />
                        <div style={{marginTop: '20px'}}>
                            <div style={{width:'42%', float:'left'}}>
                                <Label translationKey='APPOINTMENT_TIME_FROM_LABEL' defaultValue='From' />
                            </div>
                            <div>
                                <AppointmentTimePicker onChange={time => setStartTime(time)}
                                placeHolderTranslationKey='CHOOSE_TIME_PLACE_HOLDER' defaultValue="Click to select time" />
                            </div>
                        </div>
                        <div style={{marginTop: '20px'}}>
                            <div style={{width:'42%', float:'left'}}>
                                <Label translationKey='APPOINTMENT_TIME_TO_LABEL' defaultValue='To' />
                            </div>
                            <AppointmentTimePicker onChange={time => setEndTime(time)}
                                placeHolderTranslationKey='CHOOSE_TIME_PLACE_HOLDER' defaultValue="Click to select time" />
                        </div>
                    </div>
                </div>
                <div className={classNames(searchFieldsContainerRight)}>
                    <div style={{ marginBottom:'15px'}}>
                    <Label translationKey="APPOINTMENT_NOTES" defaultValue="Notes"/>
                    </div>
                    <Textarea  style={{ height:'500%'}} onChange={(notes) => setNotes(notes)}/>
                </div>
            </div>
            <AppointmentEditorFooter checkAndSave={checkAndSave}/>
        </div>
    </Fragment>);
};

AppointmentEditor.propTypes = {
    intl: PropTypes.object.isRequired,
    appConfigs: PropTypes.object
};

export default injectIntl(AppointmentEditor);
