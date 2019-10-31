import React, {Fragment, useEffect, useState} from "react";
import classNames from 'classnames';
import {
    appointmentEditor,
    dateHeading,
    recurringContainer,
    recurringContainerLeft,
    recurringContainerRight,
    searchFieldsContainer,
    searchFieldsContainerLeft,
    searchFieldsContainerRight,
    timeSelector,
    weekDaysContainer
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
import {saveAppointment, saveRecurring} from "./AppointmentEditorService";
import Label from '../Label/Label.jsx';
import {getDateTime, isStartTimeBeforeEndTime} from '../../utils/DateUtil.js'
import TimeSelector from "../TimeSelector/TimeSelector.jsx";
import AppointmentNotes from "../AppointmentNotes/AppointmentNotes.jsx";
import RecurringPlan from "../RecurringPlan/RecurringPlan.jsx";
import CustomPopup from "../CustomPopup/CustomPopup.jsx";
import SuccessConfirmation from "../SuccessModal/SuccessModal.jsx";
import {AppContext} from "../AppContext/AppContext";
import AppointmentDatePicker from "../DatePicker/DatePicker.jsx";
import StartDateRadioGroup from "../RadioGroup/StartDateRadioGroup.jsx";
import EndDateRadioGroup from "../RadioGroup/EndDateRadioGroup.jsx";
import RecurrenceTypeRadioGroup from "../RadioGroup/RecurrenceTypeRadioGroup.jsx";
import {dayRecurrenceType, FROM, MINUTES, TODAY} from "../../constants";
import moment from "moment";
import {
    getDefaultOccurrences,
    getDuration,
    getYesterday,
    isSpecialitiesEnabled,
    maxAppointmentProvidersAllowed
} from "../../helper.js";
import {getSelectedWeekDays, getWeekDays} from "../../services/WeekDaysService/WeekDaysService";
import ButtonGroup from "../ButtonGroup/ButtonGroup.jsx";

const AppointmentEditor = props => {
    const [patient, setPatient] = useState();
    const [patientError, setPatientError] = useState(false);
    const [serviceError, setServiceError] = useState(false);
    const [appointmentDateError, setAppointmentDateError] = useState(false);
    const [startDateError, setStartDateError] = useState(false);
    const [endDateError, setEndDateError] = useState(false);
    const [endDateTypeError, setEndDateTypeError] = useState(false);
    const [occurrencesError, setOccurrencesError] = useState(false);
    const [startTimeError, setStartTimeError] = useState(false);
    const [endTimeError, setEndTimeError] = useState(false);
    const [recurrencePeriodError, setRecurrencePeriodError] = useState(false);
    const [startTimeBeforeEndTimeError, setStartTimeBeforeEndTimeError] = useState(false);
    const [providers, setProviders] = useState([]);
    const [service, setService] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [location, setLocation] = useState('');
    const [speciality, setSpeciality] = useState('');
    const [appointmentDate, setAppointmentDate] = useState();
    const [recurringStartDate, setRecurringStartDate] = useState();
    const [recurringEndDate, setRecurringEndDate] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [isRecurring, setIsRecurring] = useState();
    const {appConfig} = props;
    const [notes, setNotes] = useState();
    const [startDateType, setStartDateType] = useState();
    const [endDateType, setEndDateType] = useState();
    const [recurrenceType, setRecurrenceType] = useState(dayRecurrenceType);
    const [occurrences, setOccurrences] = useState();
    const [period, setPeriod] = useState();
    const [weekDays, setWeekDays] = useState();
    const [weekDaysError, setWeekDaysError] = useState(false);

    useEffect(() => {
        if (occurrences === undefined)
            setOccurrences(getDefaultOccurrences(appConfig));
        setWeekDays(getWeekDays(appConfig && appConfig.startOfWeek));
    }, [appConfig]);

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const {intl} = props;

    const patientErrorMessage = intl.formatMessage({
        id: 'PATIENT_ERROR_MESSAGE', defaultMessage: 'Please select patient'
    });

    const serviceErrorMessage = intl.formatMessage({
        id: 'SERVICE_ERROR_MESSAGE', defaultMessage: 'Please select service'
    });

    const dateErrorMessage = intl.formatMessage({
        id: 'DATE_ERROR_MESSAGE', defaultMessage: 'Please select date'
    });

    const occurrencesErrorMessage = intl.formatMessage({
        id: 'OCCURRENCE_ERROR_MESSAGE', defaultMessage: 'Please select valid occurrences'
    });

    const endDateTypeErrorMessage = intl.formatMessage({
        id: 'ENDDATE_TYPE_ERROR_MESSAGE', defaultMessage: 'Please select recurrence end type'
    });

    const timeErrorMessage = intl.formatMessage({
        id: 'TIME_ERROR_MESSAGE', defaultMessage: 'Please select time'
    });

    const recurrencePeriodErrorMessage = intl.formatMessage({
        id: 'RECURRENCE_PERIOD_ERROR_MESSAGE', defaultMessage: 'Please select valid recurrence period'
    });

    const startTimeLessThanEndTimeMessage = intl.formatMessage({
        id: 'START_TIME_LESSTHAN_END_TME_ERROR_MESSAGE', defaultMessage: 'From time should be before to time'
    });

    const weekDaysErrorMessage = intl.formatMessage({
        id: 'RECURRENCE_WEEKDAYS_ERROR_MESSAGE', defaultMessage: 'Please select the day(s)'
    });

    const getRecurringPattern = () => {
        const recurringPattern = {
            type: recurrenceType,
            period: period
        };
        endDateType === "After" ? recurringPattern.frequency = occurrences : recurringPattern.endDate = recurringEndDate;
        if (recurrenceType === 'WEEK') {
            recurringPattern.daysOfWeek = getSelectedWeekDays(weekDays);
         }
        return recurringPattern;
    };

    const getAppointment = () => {
        let appointment = {
            patientUuid: patient && patient.uuid,
            serviceUuid: service && service.uuid,
            serviceTypeUuid: serviceType && serviceType.uuid,
            startDateTime: isRecurring ? getDateTime(recurringStartDate, startTime) : getDateTime(appointmentDate, startTime),
            endDateTime: isRecurring ? getDateTime(recurringStartDate, endTime) : getDateTime(appointmentDate, endTime),
            providers: providers,
            locationUuid: location,
            appointmentKind: "Scheduled",
            comments: notes
        };
        if (!appointment.serviceTypeUuid || appointment.serviceTypeUuid.length < 1)
            delete appointment.serviceTypeUuid;
        return appointment;
    };

    const isValidAppointment = () => {
        const isValidPatient = patient && patient.uuid;
        const startTimeBeforeEndTime = isStartTimeBeforeEndTime(startTime, endTime);
        setPatientError(!isValidPatient);
        setServiceError(!service);
        setAppointmentDateError(!appointmentDate);
        setStartTimeError(!startTime);
        setEndTimeError(!endTime);
        setStartTimeBeforeEndTimeError(!startTimeBeforeEndTime);
        return isValidPatient && service && appointmentDate && startTime && endTime && startTimeBeforeEndTime;
    };

    const {angularState} = React.useContext(AppContext);

    const isValidEndDate = () => (endDateType === "On" && recurringEndDate) ||
        (endDateType === "After" && occurrences && occurrences > 0);

    const isValidRecurringAppointment = () => {
        const isValidPatient = patient && patient.uuid;
        const startTimeBeforeEndTime = isStartTimeBeforeEndTime(startTime, endTime);
        setPatientError(!isValidPatient);
        setServiceError(!service);
        setStartTimeError(!startTime);
        setEndTimeError(!endTime);
        setStartTimeBeforeEndTimeError(!startTimeBeforeEndTime);
        setRecurrencePeriodError(!period || period < 1);
        setEndDateTypeError(!endDateType);
        if (endDateType) {
            setEndDateError(endDateType === "On" && !recurringEndDate);
            setOccurrencesError(endDateType === "After" && (!occurrences || occurrences < 1));
        }
        setWeekDaysError(recurrenceType === 'WEEK' && _.isEmpty(getSelectedWeekDays(weekDays)));
        setStartDateError(!startDateType || !recurringStartDate);
        return isValidPatient && service && startTime && endTime && startTimeBeforeEndTime &&
            recurrenceType && period && period > 0 && recurringStartDate && isValidEndDate();
    };

    const checkAndSave = async () => {
        if (isValidAppointment()) {
            const appointment = getAppointment();
            const response = await saveAppointment(appointment);
            if (response.status === 200) {
                angularState.params.viewDate = appointmentDate.startOf('day').toDate();
                setShowSuccessPopup(true);
            }
        }
    };

    const checkAndSaveRecurring = async () => {
        if (isValidRecurringAppointment()) {
            const recurringRequest = {
                appointmentRequest: getAppointment(),
                recurringPattern: getRecurringPattern()
            };
            const response = await saveRecurring(recurringRequest);
            if (response.status === 200) {
                angularState.params.viewDate = recurringStartDate.startOf('day').toDate();
                setShowSuccessPopup(true);
            }
        }
    };

    const savePopup = <CustomPopup
        popupContent={<SuccessConfirmation patientDetails={patient && `${patient.name} (${patient.identifier})`}/>}/>;

    const appointmentStartTimeProps = {
        translationKey: 'APPOINTMENT_TIME_FROM_LABEL', defaultValue: 'From',
        placeHolderTranslationKey: 'CHOOSE_TIME_PLACE_HOLDER', placeHolderDefaultMessage: 'Enter time as hh:mm am/pm',
        defaultTime: startTime
    };

    const appointmentEndTimeProps = {
        translationKey: 'APPOINTMENT_TIME_TO_LABEL', defaultValue: 'To',
        placeHolderTranslationKey: 'CHOOSE_TIME_PLACE_HOLDER', placeHolderDefaultMessage: 'Enter time as hh:mm am/pm',
        defaultTime: endTime
    };

    const endTimeBasedOnService = (time, service, serviceType) => {
        const currentTime = moment(time);
        const duration = getDuration(service, serviceType);
        currentTime.add(duration, MINUTES);
        if (time) {
            setEndTime(currentTime);
            setEndTimeError(false);
        }
    };

    const getEndDateTypeErrorMessage = () => {
        if (endDateTypeError) return endDateTypeErrorMessage;
        if (endDateError) return dateErrorMessage;
        if (occurrencesError) return occurrencesErrorMessage;
    };

    const startDateOnChange = value => {
        setStartDateType(value);
        if (value === TODAY) {
            setRecurringStartDate(moment());
            setStartDateError(false);
        }
        else {
            setRecurringEndDate(undefined);
            setStartDateError(!recurringStartDate);
        }
    };

    const endDateOnChange = value => {
        setEndDateType(value);
        setEndDateTypeError(false);
        value === "After" && setEndDateError(false);
        if (value === "On") {
            setEndDateError(recurringStartDate && !recurringEndDate);
            setOccurrencesError(false);
        }
    };

    return (<Fragment>
        <div data-testid="appointment-editor" className={classNames(appointmentEditor)}>
            <div className={classNames(searchFieldsContainer)}>
                <div className={classNames(searchFieldsContainerLeft)}>
                    <div data-testid="patient-search">
                        <PatientSearch onChange={(optionSelected) => {
                            const newValue = optionSelected ? optionSelected.value : undefined;
                            setPatient(newValue);
                            setPatientError(!newValue);
                        }}/>
                        <ErrorMessage message={patientError ? patientErrorMessage : undefined}/>
                    </div>
                    <div data-testid="service-search">
                        <ServiceSearch onChange={(optionSelected) => {
                            setService(optionSelected.value);
                            setServiceError(!optionSelected.value);
                            endTimeBasedOnService(startTime, optionSelected.value, undefined);
                        }}
                                       specialityUuid={speciality}/>
                        <ErrorMessage message={serviceError ? serviceErrorMessage : undefined}/>
                    </div>
                    <div data-testid="service-type-search">
                        <ServiceTypeSearch onChange={(optionSelected) => {
                            setServiceType(optionSelected.value);
                            endTimeBasedOnService(startTime, undefined, optionSelected.value);
                        }}
                                           serviceUuid={service.uuid}/>
                    </div>
                    {isSpecialitiesEnabled(appConfig) ?
                        <div data-testid="speciality-search">
                            <SpecialitySearch onChange={(optionSelected) => setSpeciality(optionSelected.value)}/>
                        </div> : null
                    }
                    <div data-testid="location-search">
                        <LocationSearch onChange={(optionSelected) => setLocation(optionSelected.value)}/>
                        <ErrorMessage message={undefined}/>
                    </div>
                </div>
                <div className={classNames(searchFieldsContainerRight)} data-testid="provider-search">
                    <ProviderSearch onChange={selectedProviders => setProviders(selectedProviders)}
                                    maxAppointmentProvidersAllowed={maxAppointmentProvidersAllowed(appConfig)}/>
                </div>
            </div>
            <div className={classNames(searchFieldsContainer)} data-testid="recurring-plan-checkbox">
                <div className={classNames(searchFieldsContainerLeft)}>
                    <RecurringPlan onChange={event => setIsRecurring(event.target.checked)}/>
                </div>
            </div>
            <div className={classNames(recurringContainer)}>
                {isRecurring ?
                    <div className={classNames(recurringContainerLeft)}>
                        <div data-testid="start-date-group">
                            <div className={classNames(dateHeading)}>
                                <Label translationKey="STARTS_LABEL" defaultValue="Starts"/>
                            </div>
                            <StartDateRadioGroup
                                onChange={event => startDateOnChange(event.target.value)}
                                startDateType={startDateType}/>
                            <AppointmentDatePicker
                                onChange={date => {
                                    setRecurringStartDate(date);
                                    setStartDateError(!date);
                                    setRecurringEndDate(undefined);
                                }}
                                onClear={() => setRecurringStartDate(undefined)}
                                defaultValue={recurringStartDate}
                                minDate={startDateType === FROM ? getYesterday() : undefined}/>
                            <ErrorMessage message={startDateError ? dateErrorMessage : undefined}/>
                        </div>
                        <div data-testid="end-date-group">
                            <div className={classNames(dateHeading)}>
                                <Label translationKey="ENDS_LABEL" defaultValue="Ends"/>
                            </div>
                            <EndDateRadioGroup
                                onChange={event => endDateOnChange(event.target.value)}
                                onOccurrencesChange={value => setOccurrences(value)}
                                occurrences={occurrences}
                                endDateType={endDateType}/>
                            <AppointmentDatePicker
                                onChange={date => {
                                    setRecurringEndDate(date);
                                    setEndDateError(!date);
                                }}
                                onClear={() => setRecurringEndDate(undefined)}
                                defaultValue={recurringEndDate}
                                minDate={endDateType === "On" ?  recurringStartDate :
                                    undefined}/>

                            <ErrorMessage message={getEndDateTypeErrorMessage()}/>

                        </div>
                        <div data-testid="recurrence-type-group">
                            <div>
                            <div className={classNames(dateHeading)}>
                                <Label translationKey="REPEATS_EVERY_LABEL" defaultValue="Repeats Every"/>
                            </div>
                            <div>
                                <div>
                                    <RecurrenceTypeRadioGroup
                                        onChange={event => {
                                            setRecurrenceType(event.currentTarget.value);
                                            setWeekDaysError(weekDaysError && event.currentTarget.value === 'WEEK');
                                        }}
                                        onPeriodChange={value => {
                                            setPeriod(value);
                                            setRecurrencePeriodError(false);
                                        }}
                                        period={period}
                                        recurrenceType={recurrenceType}/>
                                    <ErrorMessage
                                        message={recurrencePeriodError ? recurrencePeriodErrorMessage : undefined}/>
                                </div>
                                <div className={classNames(weekDaysContainer)}>
                                    <ButtonGroup buttonsList={weekDays} onClick={buttonKey => {
                                        const prevWeekDaysMap = new Map(weekDays);
                                        const nextEntry = {
                                            ...prevWeekDaysMap.get(buttonKey),
                                            isSelected: !prevWeekDaysMap.get(buttonKey).isSelected
                                        };
                                        prevWeekDaysMap.set(buttonKey, nextEntry);
                                        setWeekDays(prevWeekDaysMap);
                                        setWeekDaysError(false);
                                    }} enable={recurrenceType === 'WEEK'}/>
                                    <ErrorMessage
                                        message={weekDaysError ? weekDaysErrorMessage : undefined}/>
                                </div>
                            </div>
                            </div>
                            <div className={classNames(timeSelector)}>
                                <Label translationKey="APPOINTMENT_TIME_LABEL" defaultValue="Choose a time slot"/>
                                <div data-testid="start-time-selector">
                                    <TimeSelector {...appointmentStartTimeProps}
                                                  onChange={time => {
                                                      setStartTime(time);
                                                      endTimeBasedOnService(time, service, serviceType);
                                                      setStartTimeError(!time);
                                                  }}/>
                                    <ErrorMessage message={startTimeError ? timeErrorMessage : undefined}/>
                                </div>
                                <div data-testid="end-time-selector">
                                    <TimeSelector {...appointmentEndTimeProps}
                                                  onChange={time => {
                                                      setEndTime(time);
                                                      setStartTimeBeforeEndTimeError(!isStartTimeBeforeEndTime(startTime, time));
                                                      setEndTimeError(!time);
                                                  }}/>
                                    <ErrorMessage message={endTimeError ? timeErrorMessage : undefined}/>
                                </div>
                                <ErrorMessage
                                    message={startTime && endTime && startTimeBeforeEndTimeError ? startTimeLessThanEndTimeMessage : undefined}/>
                            </div>
                        </div>
                    </div> :
                    <div className={classNames(recurringContainerLeft)}>
                        <div data-testid="date-selector">
                            <Label translationKey="APPOINTMENT_DATE_LABEL" defaultValue="Appointment date"/>
                            <AppointmentDatePicker
                                onChange={date => {
                                    setAppointmentDate(date);
                                    setAppointmentDateError(!date);
                                }}
                                onClear={() => setAppointmentDate(undefined)}
                                defaultValue={appointmentDate}
                                minDate={getYesterday()}/>
                            <ErrorMessage message={appointmentDateError ? dateErrorMessage : undefined}/>
                        </div>
                        <div>
                            <Label translationKey="APPOINTMENT_TIME_LABEL" defaultValue="Choose a time slot"/>
                            <div data-testid="start-time-selector">
                                <TimeSelector {...appointmentStartTimeProps}
                                              onChange={time => {
                                                  setStartTime(time);
                                                  endTimeBasedOnService(time, service, serviceType);
                                                  setStartTimeError(!time);
                                              }}/>
                                <ErrorMessage message={startTimeError ? timeErrorMessage : undefined}/>
                            </div>
                            <div data-testid="end-time-selector">
                                <TimeSelector {...appointmentEndTimeProps}
                                              onChange={time => {
                                                  setEndTime(time);
                                                  setStartTimeBeforeEndTimeError(!isStartTimeBeforeEndTime(startTime, time));
                                                  setEndTimeError(!time);
                                              }}/>
                                <ErrorMessage message={endTimeError ? timeErrorMessage : undefined}/>
                            </div>
                            <ErrorMessage
                                message={startTime && endTime && startTimeBeforeEndTimeError ? startTimeLessThanEndTimeMessage : undefined}/>
                        </div>
                    </div>}
                <div className={classNames(recurringContainerRight)}>
                    <Label translationKey="APPOINTMENT_NOTES" defaultValue="Notes"/>
                    <AppointmentNotes onChange={(event) => setNotes(event.target.value)}/>
                </div>
            </div>
            <AppointmentEditorFooter checkAndSave={isRecurring ? checkAndSaveRecurring : checkAndSave}/>
            {showSuccessPopup ? React.cloneElement(savePopup, {
                open: true,
                closeOnDocumentClick: false,
                closeOnEscape: false
            }) : undefined}
        </div>
    </Fragment>);
};

AppointmentEditor.propTypes = {
    intl: PropTypes.object.isRequired,
    appConfig: PropTypes.object
};

export default injectIntl(AppointmentEditor);
