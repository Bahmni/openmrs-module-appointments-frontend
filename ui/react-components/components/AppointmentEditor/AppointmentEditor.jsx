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
import {getErrorTranslations} from "../../utils/ErrorTranslationsUtil";
import {isEmpty} from 'lodash';

const AppointmentEditor = props => {

    const {appConfig, intl} = props;
    const {angularState} = React.useContext(AppContext);
    const errorTranslations = getErrorTranslations(intl);

    const initialAppointmentState = {
        patient: undefined,
        providers: [],
        service: undefined,
        serviceType: undefined,
        location: undefined,
        speciality: undefined,
        appointmentDate: undefined,
        recurringStartDate: undefined,
        recurringEndDate: undefined,
        startTime: undefined,
        endTime: undefined,
        isRecurring: false,
        notes: undefined,
        startDateType: undefined,
        endDateType: undefined,
        recurrenceType: undefined,
        occurrences: undefined,
        period: undefined,
        weekDays: undefined
    };

    const [appointmentDetails, setAppointmentDetails] = useState(initialAppointmentState);
    const [errors, setErrors] = useState({
        patientError: false,
        serviceError: false,
        appointmentDateError: false,
        startDateError: false,
        endDateError: false,
        endDateTypeError: false,
        occurrencesError: false,
        startTimeError: false,
        endTimeError: false,
        recurrencePeriodError: false,
        startTimeBeforeEndTimeError: false,
        weekDaysError: false
    });
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        if (appointmentDetails.occurrences === undefined)
            updateAppointmentDetails({occurrences: getDefaultOccurrences(appConfig)});
        updateAppointmentDetails({weekDays: getWeekDays(appConfig && appConfig.startOfWeek)});
    }, [appConfig]);

    const getRecurringPattern = () => {
        const recurringPattern = {
            type: appointmentDetails.recurrenceType,
            period: appointmentDetails.period
        };
        appointmentDetails.endDateType === "After" ? recurringPattern.frequency = appointmentDetails.occurrences : recurringPattern.endDate = appointmentDetails.recurringEndDate;
        if (appointmentDetails.recurrenceType === 'WEEK') {
            recurringPattern.daysOfWeek = getSelectedWeekDays(appointmentDetails.weekDays);
        }
        return recurringPattern;
    };

    const getAppointment = () => {
        let appointment = {
            patientUuid: appointmentDetails.patient && appointmentDetails.patient.uuid,
            serviceUuid: appointmentDetails.service && appointmentDetails.service.uuid,
            serviceTypeUuid: appointmentDetails.serviceType && appointmentDetails.serviceType.uuid,
            startDateTime: appointmentDetails.isRecurring
                ? getDateTime(appointmentDetails.recurringStartDate, appointmentDetails.startTime)
                : getDateTime(appointmentDetails.appointmentDate, appointmentDetails.startTime),
            endDateTime: appointmentDetails.isRecurring
                ? getDateTime(appointmentDetails.recurringStartDate, appointmentDetails.endTime)
                : getDateTime(appointmentDetails.appointmentDate, appointmentDetails.endTime),
            providers: appointmentDetails.providers,
            locationUuid: appointmentDetails.location,
            appointmentKind: "Scheduled",
            comments: appointmentDetails.notes
        };
        if (!appointment.serviceTypeUuid || appointment.serviceTypeUuid.length < 1)
            delete appointment.serviceTypeUuid;
        return appointment;
    };

    const updateErrorIndicators = errorIndicators => setErrors(prevErrors => {return {...prevErrors, ...errorIndicators}});

    const updateAppointmentDetails = modifiedAppointmentDetails => setAppointmentDetails(prevAppointmentDetails => {
        return {...prevAppointmentDetails, ...modifiedAppointmentDetails}
    });

    const isValidAppointment = () => {
        const isValidPatient = appointmentDetails.patient && appointmentDetails.patient.uuid;
        const startTimeBeforeEndTime = isStartTimeBeforeEndTime(appointmentDetails.startTime, appointmentDetails.endTime);
        updateCommonErrorIndicators(isValidPatient, startTimeBeforeEndTime);
        updateErrorIndicators({appointmentDateError: !appointmentDetails.appointmentDate});
        return isValidPatient && appointmentDetails.service && appointmentDetails.appointmentDate && appointmentDetails.startTime && appointmentDetails.endTime && startTimeBeforeEndTime;
    };

    const isValidRecurringAppointment = () => {
        const isValidPatient = appointmentDetails.patient && appointmentDetails.patient.uuid;
        const startTimeBeforeEndTime = isStartTimeBeforeEndTime(appointmentDetails.startTime, appointmentDetails.endTime);
        updateCommonErrorIndicators(isValidPatient, startTimeBeforeEndTime);
        updateErrorIndicators({
            recurrencePeriodError: !appointmentDetails.period || appointmentDetails.period < 1,
            endDateTypeError: !appointmentDetails.endDateType,
            weekDaysError: appointmentDetails.recurrenceType === 'WEEK' && isEmpty(getSelectedWeekDays(appointmentDetails.weekDays)),
            startDateError: !appointmentDetails.startDateType || !appointmentDetails.recurringStartDate
        });
        if (appointmentDetails.endDateType) {
            updateErrorIndicators({
                endDateError: appointmentDetails.endDateType === "On" && !appointmentDetails.recurringEndDate,
                occurrencesError: appointmentDetails.endDateType === "After" && (!appointmentDetails.occurrences || appointmentDetails.occurrences < 1)
            })
        }
        return isValidPatient && appointmentDetails.service && appointmentDetails.startTime && appointmentDetails.endTime && startTimeBeforeEndTime &&
            appointmentDetails.recurrenceType && appointmentDetails.period && appointmentDetails.period > 0 && appointmentDetails.recurringStartDate && isValidEndDate();
    };

    const updateCommonErrorIndicators = (isValidPatient, startTimeBeforeEndTime) => updateErrorIndicators({
        patientError: !isValidPatient,
        serviceError: !appointmentDetails.service,
        startTimeError: !appointmentDetails.startTime,
        endTimeError: !appointmentDetails.endTime,
        startTimeBeforeEndTimeError: !startTimeBeforeEndTime
    });

    const isValidEndDate = () => (appointmentDetails.endDateType === "On" && appointmentDetails.recurringEndDate) ||
        (appointmentDetails.endDateType === "After" && appointmentDetails.occurrences && appointmentDetails.occurrences > 0);

    const checkAndSave = async () => {
        if (isValidAppointment()) {
            const appointment = getAppointment();
            const response = await saveAppointment(appointment);
            if (response.status === 200) {
                angularState.params.viewDate = appointmentDetails.appointmentDate.startOf('day').toDate();
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
                angularState.params.viewDate = appointmentDetails.recurringStartDate.startOf('day').toDate();
                setShowSuccessPopup(true);
            }
        }
    };

    const savePopup = <CustomPopup
        popupContent={<SuccessConfirmation patientDetails={appointmentDetails.patient && `${appointmentDetails.patient.name} (${appointmentDetails.patient.identifier})`}/>}/>;

    const appointmentStartTimeProps = {
        translationKey: 'APPOINTMENT_TIME_FROM_LABEL', defaultValue: 'From',
        placeHolderTranslationKey: 'CHOOSE_TIME_PLACE_HOLDER', placeHolderDefaultMessage: 'Enter time as hh:mm am/pm',
        defaultTime: appointmentDetails.startTime
    };

    const appointmentEndTimeProps = {
        translationKey: 'APPOINTMENT_TIME_TO_LABEL', defaultValue: 'To',
        placeHolderTranslationKey: 'CHOOSE_TIME_PLACE_HOLDER', placeHolderDefaultMessage: 'Enter time as hh:mm am/pm',
        defaultTime: appointmentDetails.endTime
    };

    const endTimeBasedOnService = (time, service, serviceType) => {
        const currentTime = moment(time);
        const duration = getDuration(service, serviceType);
        currentTime.add(duration, MINUTES);
        if (time) {
            updateAppointmentDetails({endTime: currentTime});
            updateErrorIndicators({endTimeError: false});
        }
    };

    const getEndDateTypeErrorMessage = () => {
        if (errors.endDateTypeError) return errorTranslations.endDateTypeErrorMessage;
        if (errors.endDateError) return errorTranslations.dateErrorMessage;
        if (errors.occurrencesError) return errorTranslations.occurrencesErrorMessage;
    };

    const startDateOnChange = value => {
        updateAppointmentDetails({startDateType: value});
        if (value === TODAY) {
            updateAppointmentDetails({recurringStartDate: moment()});
            updateErrorIndicators({startDateError: false});
        } else {
            updateAppointmentDetails({recurringEndDate: undefined});
            updateErrorIndicators({startDateError: !appointmentDetails.recurringStartDate});
        }
    };

    const endDateOnChange = value => {
        updateAppointmentDetails({endDateType: value});
        updateErrorIndicators({endDateTypeError: false});
        value === "After" && updateErrorIndicators({endDateError: false});
        if (value === "On") {
            updateErrorIndicators({endDateError: appointmentDetails.recurringStartDate && !appointmentDetails.recurringEndDate, occurrencesError: false});
        }
    };

    return (<Fragment>
        <div data-testid="appointment-editor" className={classNames(appointmentEditor)}>
            <div className={classNames(searchFieldsContainer)}>
                <div className={classNames(searchFieldsContainerLeft)}>
                    <div data-testid="patient-search">
                        <PatientSearch
                            onChange={(optionSelected) => {
                            const newValue = optionSelected ? optionSelected.value : undefined;
                            updateAppointmentDetails({patient: newValue});
                            updateErrorIndicators({patientError: !newValue});
                        }}/>
                        <ErrorMessage message={errors.patientError ? errorTranslations.patientErrorMessage : undefined}/>
                    </div>
                    <div data-testid="service-search">
                        <ServiceSearch onChange={(optionSelected) => {
                            updateAppointmentDetails({service: optionSelected.value});
                            updateErrorIndicators({serviceError: !optionSelected.value});
                            endTimeBasedOnService(appointmentDetails.startTime, optionSelected.value, undefined);
                        }}
                                       specialityUuid={appointmentDetails.speciality}/>
                        <ErrorMessage message={errors.serviceError ? errorTranslations.serviceErrorMessage : undefined}/>
                    </div>
                    <div data-testid="service-type-search">
                        <ServiceTypeSearch onChange={(optionSelected) => {
                            updateAppointmentDetails({serviceType: optionSelected.value});
                            endTimeBasedOnService(appointmentDetails.startTime, undefined, optionSelected.value);
                        }}
                       serviceUuid={appointmentDetails.service && appointmentDetails.service.uuid}/>
                    </div>
                    {isSpecialitiesEnabled(appConfig) ?
                        <div data-testid="speciality-search">
                            <SpecialitySearch onChange={(optionSelected) => updateAppointmentDetails({speciality: optionSelected.value})}/>
                        </div> : null
                    }
                    <div data-testid="location-search">
                        <LocationSearch onChange={(optionSelected) => updateAppointmentDetails({location: optionSelected.value})}/>
                        <ErrorMessage message={undefined}/>
                    </div>
                </div>
                <div className={classNames(searchFieldsContainerRight)} data-testid="provider-search">
                    <ProviderSearch onChange={selectedProviders => updateAppointmentDetails({providers: selectedProviders})}
                                    maxAppointmentProvidersAllowed={maxAppointmentProvidersAllowed(appConfig)}/>
                </div>
            </div>
            <div className={classNames(searchFieldsContainer)} data-testid="recurring-plan-checkbox">
                <div className={classNames(searchFieldsContainerLeft)}>
                    <RecurringPlan onChange={event => updateAppointmentDetails({isRecurring: event.target.checked})}/>
                </div>
            </div>
            <div className={classNames(recurringContainer)}>
                {appointmentDetails.isRecurring ?
                    <div className={classNames(recurringContainerLeft)}>
                        <div data-testid="start-date-group">
                            <div className={classNames(dateHeading)}>
                                <Label translationKey="STARTS_LABEL" defaultValue="Starts"/>
                            </div>
                            <StartDateRadioGroup
                                onChange={event => startDateOnChange(event.target.value)}
                                startDateType={appointmentDetails.startDateType}/>
                            <AppointmentDatePicker
                                onChange={date => {
                                    updateAppointmentDetails({recurringStartDate: date});
                                    updateErrorIndicators({startDateError: !date});
                                    updateAppointmentDetails({recurringEndDate: undefined});
                                }}
                                onClear={() => updateAppointmentDetails({recurringStartDate: undefined})}
                                defaultValue={appointmentDetails.recurringStartDate}
                                minDate={appointmentDetails.startDateType === FROM ? getYesterday() : undefined}/>
                            <ErrorMessage message={errors.startDateError ? errorTranslations.dateErrorMessage : undefined}/>
                        </div>
                        <div data-testid="end-date-group">
                            <div className={classNames(dateHeading)}>
                                <Label translationKey="ENDS_LABEL" defaultValue="Ends"/>
                            </div>
                            <EndDateRadioGroup
                                onChange={event => endDateOnChange(event.target.value)}
                                onOccurrencesChange={value => updateAppointmentDetails({occurrences: value})}
                                occurrences={appointmentDetails.occurrences}
                                endDateType={appointmentDetails.endDateType}/>
                            <AppointmentDatePicker
                                onChange={date => {
                                    updateAppointmentDetails({recurringEndDate: date});
                                    updateErrorIndicators({endDateError: !date});
                                }}
                                onClear={() => updateAppointmentDetails({recurringEndDate: undefined})}
                                defaultValue={appointmentDetails.recurringEndDate}
                                minDate={appointmentDetails.endDateType === "On" ?  appointmentDetails.recurringStartDate : undefined}/>
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
                                            updateAppointmentDetails({recurrenceType: event.currentTarget.value});
                                            updateErrorIndicators({weekDaysError: errors.weekDaysError && event.currentTarget.value === 'WEEK'});
                                        }}
                                        onPeriodChange={value => {
                                            updateAppointmentDetails({period: value});
                                            updateErrorIndicators({recurrencePeriodError: false});
                                        }}
                                        period={appointmentDetails.period}
                                        recurrenceType={appointmentDetails.recurrenceType}/>
                                    <ErrorMessage
                                        message={errors.recurrencePeriodError ? errorTranslations.recurrencePeriodErrorMessage : undefined}/>
                                </div>
                                <div className={classNames(weekDaysContainer)}>
                                    <ButtonGroup buttonsList={appointmentDetails.weekDays} onClick={buttonKey => {
                                        const prevWeekDaysMap = new Map(appointmentDetails.weekDays);
                                        const nextEntry = {
                                            ...prevWeekDaysMap.get(buttonKey),
                                            isSelected: !prevWeekDaysMap.get(buttonKey).isSelected
                                        };
                                        prevWeekDaysMap.set(buttonKey, nextEntry);
                                        updateAppointmentDetails({weekDays: prevWeekDaysMap});
                                        updateErrorIndicators({weekDaysError: false});
                                    }} enable={appointmentDetails.recurrenceType === 'WEEK'}/>
                                    <ErrorMessage
                                        message={errors.weekDaysError ? errorTranslations.weekDaysErrorMessage : undefined}/>
                                </div>
                            </div>
                            </div>
                            <div className={classNames(timeSelector)}>
                                <Label translationKey="APPOINTMENT_TIME_LABEL" defaultValue="Choose a time slot"/>
                                <div data-testid="start-time-selector">
                                    <TimeSelector {...appointmentStartTimeProps}
                                                  onChange={time => {
                                                      updateAppointmentDetails({startTime: time});
                                                      endTimeBasedOnService(time, appointmentDetails.service, appointmentDetails.serviceType);
                                                      updateErrorIndicators({startTimeError: !time});
                                                  }}/>
                                    <ErrorMessage message={errors.startTimeError ? errorTranslations.timeErrorMessage : undefined}/>
                                </div>
                                <div data-testid="end-time-selector">
                                    <TimeSelector {...appointmentEndTimeProps}
                                                  onChange={time => {
                                                      updateAppointmentDetails({endTime: time});
                                                      updateErrorIndicators({
                                                          startTimeBeforeEndTimeError: !isStartTimeBeforeEndTime(appointmentDetails.startTime, time),
                                                          endTimeError: !time
                                                      });
                                                  }}/>
                                    <ErrorMessage message={errors.endTimeError ? errorTranslations.timeErrorMessage : undefined}/>
                                </div>
                                <ErrorMessage
                                    message={appointmentDetails.startTime && appointmentDetails.endTime && errors.startTimeBeforeEndTimeError ? errorTranslations.startTimeLessThanEndTimeMessage : undefined}/>
                            </div>
                        </div>
                    </div> :
                    <div className={classNames(recurringContainerLeft)}>
                        <div data-testid="date-selector">
                            <Label translationKey="APPOINTMENT_DATE_LABEL" defaultValue="Appointment date"/>
                            <AppointmentDatePicker
                                onChange={date => {
                                    updateAppointmentDetails({appointmentDate: date});
                                    updateErrorIndicators({appointmentDateError: !date});
                                }}
                                onClear={() => updateAppointmentDetails({appointmentDate: undefined})}
                                defaultValue={appointmentDetails.appointmentDate}
                                minDate={getYesterday()}/>
                            <ErrorMessage message={errors.appointmentDateError ? errorTranslations.dateErrorMessage : undefined}/>
                        </div>
                        <div>
                            <Label translationKey="APPOINTMENT_TIME_LABEL" defaultValue="Choose a time slot"/>
                            <div data-testid="start-time-selector">
                                <TimeSelector {...appointmentStartTimeProps}
                                              onChange={time => {
                                                  updateAppointmentDetails({startTime: time});
                                                  endTimeBasedOnService(time, appointmentDetails.service, appointmentDetails.serviceType);
                                                  updateErrorIndicators({startTimeError: !time});
                                              }}/>
                                <ErrorMessage message={errors.startTimeError ? errorTranslations.timeErrorMessage : undefined}/>
                            </div>
                            <div data-testid="end-time-selector">
                                <TimeSelector {...appointmentEndTimeProps}
                                              onChange={time => {
                                                  updateAppointmentDetails({endTime: time});
                                                  updateErrorIndicators({
                                                      startTimeBeforeEndTimeError: !isStartTimeBeforeEndTime(appointmentDetails.startTime, time),
                                                      endTimeError: !time
                                                  });
                                              }}/>
                                <ErrorMessage message={errors.endTimeError ? errorTranslations.timeErrorMessage : undefined}/>
                            </div>
                            <ErrorMessage
                                message={appointmentDetails.startTime && appointmentDetails.endTime && errors.startTimeBeforeEndTimeError ? errorTranslations.startTimeLessThanEndTimeMessage : undefined}/>
                        </div>
                    </div>}
                <div className={classNames(recurringContainerRight)}>
                    <Label translationKey="APPOINTMENT_NOTES" defaultValue="Notes"/>
                    <AppointmentNotes onChange={(event) => updateAppointmentDetails({notes: event.target.value})}/>
                </div>
            </div>
            <AppointmentEditorFooter checkAndSave={appointmentDetails.isRecurring ? checkAndSaveRecurring : checkAndSave}/>
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
