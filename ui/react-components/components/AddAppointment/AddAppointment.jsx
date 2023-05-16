import React, { useEffect, useState} from "react";
import classNames from 'classnames';
import {
    appointmentEditor,
    appointmentPlanContainer,
    dateHeading,
    isRecurring,
    recurringContainer,
    recurringContainerLeft,
    tableWrapper,
    teleconsultation,
    timeSelector,
    weekDaysContainer,
    overlay,
    close,
} from './AddAppointment.module.scss';
import {customPopup} from "../CustomPopup/CustomPopup.module.scss";
import ErrorMessage from "../ErrorMessage/ErrorMessage.jsx";
import AppointmentEditorFooter from "../AppointmentEditorFooter/AppointmentEditorFooter.jsx";
import {injectIntl} from "react-intl";
import PropTypes from "prop-types";
import {
    getAppointmentConflicts,
    getRecurringAppointmentsConflicts,
    saveAppointment,
    saveRecurring
} from "../../services/AppointmentsService/AppointmentsService";
import Label from '../Label/Label.jsx';
import {getDateTime, isStartTimeBeforeEndTime} from '../../utils/DateUtil.js'
import {getAppointmentBookingMessage, getRecurringAppointmentBookingMessage, getPhoneNumber} from '../../utils/AppointmentSMS.js'
import TimeSelector from "../TimeSelector/TimeSelector.jsx";
import AppointmentNotes from "../AppointmentNotes/AppointmentNotes.jsx";
import AppointmentType from "../AppointmentType/AppointmentType.jsx";
import CustomPopup from "../CustomPopup/CustomPopup.jsx";
import SuccessConfirmation from "../SuccessModal/SuccessModal.jsx";
import {AppContext} from "../AppContext/AppContext";
import AppointmentDatePicker from "../DatePicker/DatePicker.jsx";
import StartDateRadioGroup from "../RadioGroup/StartDateRadioGroup.jsx";
import EndDateRadioGroup from "../RadioGroup/EndDateRadioGroup.jsx";
import RecurrenceTypeRadioGroup from "../RadioGroup/RecurrenceTypeRadioGroup.jsx";
import {
    appointmentEndTimeProps,
    appointmentStartTimeProps,
    CANCEL_CONFIRMATION_MESSAGE_ADD,
    dayRecurrenceType,
    FROM,
    MINUTES,
    RECURRING_APPOINTMENT_TYPE,
    SERVICE_ERROR_MESSAGE_TIME_OUT_INTERVAL,
    TODAY,
    WALK_IN_APPOINTMENT_TYPE,
    VIRTUAL_APPOINTMENT_TYPE,
    SCHEDULED_APPOINTMENT_TYPE,
    APPOINTMENT_STATUSES
} from "../../constants";
import moment from "moment";
import {getDefaultOccurrences, getDuration} from "../../helper.js";
import {getSelectedWeekDays, getWeekDays} from "../../services/WeekDaysService/WeekDaysService";
import ButtonGroup from "../ButtonGroup/ButtonGroup.jsx";
import {getErrorTranslations} from "../../utils/ErrorTranslationsUtil";
import {isEmpty, isNil} from 'lodash';
import AppointmentEditorCommonFieldsWrapper
    from "../AppointmentEditorCommonFieldsWrapper/AppointmentEditorCommonFieldsWrapper.jsx";
import Conflicts from "../Conflicts/Conflicts.jsx";
import updateAppointmentStatusAndProviderResponse from "../../appointment-request/AppointmentRequest";
import * as patientApi from "../../api/patientApi";
import {mapOpenMRSPatient} from "../../mapper/patientMapper";
import {sendSMS} from "../../api/smsService";
import DatePickerCarbon from "../DatePickerCarbon/DatePickerCarbon.jsx";
import { Close24 } from '@carbon/icons-react';
import { ContentSwitcher, Switch } from 'carbon-components-react';
import '../../carbon-conflict-fixes.scss';
import '../../carbon-theme.scss';
import './AddAppointment.module.scss';
import CancelConfirmation from "../CancelConfirmation/CancelConfirmation.jsx";
import {isAppointmentPriorityOptionEnabled} from "../../helper";

const AddAppointment = props => {

    const {appConfig, intl, appointmentParams, currentProvider, urlParams, isAppointmentSMSEnabled } = props;
    const {setViewDate} = React.useContext(AppContext);
    const errorTranslations = getErrorTranslations(intl);
    const [selectedPriority, setSelectedPriority] = useState({})

    const initialAppointmentState = {
        patient: null,
        providers: [],
        service: null,
        serviceType: null,
        location: null,
        speciality: null,
        appointmentDate: appointmentParams && moment(new Date(appointmentParams.startDateTime)),
        recurringStartDate: appointmentParams && moment(new Date(appointmentParams.startDateTime)),
        recurringEndDate: undefined,
        startTime: appointmentParams && moment(appointmentParams.startDateTime),
        endTime: appointmentParams && moment(appointmentParams.endDateTime),
        appointmentType: undefined,
        teleconsultation: false,
        notes: undefined,
        startDateType: appointmentParams && moment(new Date(appointmentParams.startDateTime)) ? FROM : undefined,
        endDateType: undefined,
        recurrenceType: dayRecurrenceType,
        occurrences: undefined,
        period: undefined,
        weekDays: undefined,
        selectedRecurringStartDate: appointmentParams && moment(new Date(appointmentParams.startDateTime)),
        priority: undefined,
    };

    const initialErrorsState = {
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
        weekDaysError: false,
        providerError: false,
        priorityError: false
    };

    const [appointmentDetails, setAppointmentDetails] = useState(initialAppointmentState);
    const [showEmailWarning, setShowEmailWarning] = useState(false);
    const [showEmailNotSentWarning, setShowEmailNotSentWarning] = useState(false);
    const [conflicts, setConflicts] = useState();
    const [errors, setErrors] = useState(initialErrorsState);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [serviceErrorMessage, setServiceErrorMessage] = useState('');
    const [disableSaveButton, setDisableSaveButton] = useState(false);

    useEffect(() => {
        if (appointmentDetails.occurrences === undefined)
            updateAppointmentDetails({occurrences: getDefaultOccurrences(appConfig)});
        updateAppointmentDetails({weekDays: getWeekDays(appConfig && appConfig.startOfWeek)});
        if(urlParams && urlParams.patient) {
            populatePatientDetails(urlParams.patient).then();
        }
    }, [appConfig]);

    useEffect(() => {
        updateErrorIndicators({priorityError: undefined});
        if (isDatelessAppointment())
            updateErrorIndicators({
                appointmentDateError: undefined,
                startTimeError: undefined,
                startTimeBeforeEndTimeError: undefined,
                endTimeError: undefined
            });
    }, [selectedPriority]);

    async function populatePatientDetails(patientUuid) {
        const patient = await patientApi.getPatient(patientUuid);
        const patientForDropdown = mapOpenMRSPatient(patient);
        return updateAppointmentDetails({patient: patientForDropdown});
    }

    const reInitialiseComponent = () => {
        updateAppointmentDetails({
            ...initialAppointmentState,
            weekDays: getWeekDays(appConfig && appConfig.startOfWeek)
        });
        updateErrorIndicators(initialErrorsState);
        setConflicts(undefined);
        setShowSuccessPopup(false);
    };

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

    const isRecurringAppointment = () => appointmentDetails.appointmentType === RECURRING_APPOINTMENT_TYPE;
    const isWalkInAppointment = () => appointmentDetails.appointmentType === WALK_IN_APPOINTMENT_TYPE;
    const isTeleConsultation = () => appointmentDetails.teleconsultation;

    const requestAppointmentType = () => {
        if (appointmentDetails.teleconsultation) {
            return VIRTUAL_APPOINTMENT_TYPE;
        }
        if (isRecurringAppointment()) {
            return SCHEDULED_APPOINTMENT_TYPE;
        }
        return isWalkInAppointment() ? WALK_IN_APPOINTMENT_TYPE : SCHEDULED_APPOINTMENT_TYPE;
    };

    const getAppointmentRequest = () => {
        let appointment = {
            patientUuid: appointmentDetails.patient && appointmentDetails.patient.value.uuid,
            serviceUuid: appointmentDetails.service && appointmentDetails.service.value.uuid,
            serviceTypeUuid: appointmentDetails.serviceType && appointmentDetails.serviceType.value &&
                appointmentDetails.serviceType.value.uuid,
            startDateTime: isRecurringAppointment()
                ? getDateTime(appointmentDetails.recurringStartDate, appointmentDetails.startTime)
                : getDateTime(appointmentDetails.appointmentDate, appointmentDetails.startTime),
            endDateTime: isRecurringAppointment()
                ? getDateTime(appointmentDetails.recurringStartDate, appointmentDetails.endTime)
                : getDateTime(appointmentDetails.appointmentDate, appointmentDetails.endTime),
            providers: appointmentDetails.providers,
            locationUuid: appointmentDetails.location && appointmentDetails.location.value.uuid,
            appointmentKind: requestAppointmentType(),
            comments: appointmentDetails.notes,
            priority: appointmentDetails.priority || null,
        };
        if (!appointment.serviceTypeUuid || appointment.serviceTypeUuid.length < 1)
            delete appointment.serviceTypeUuid;
        return appointment;
    };

    const getRecurringAppointmentRequest = () => {
        return {
            appointmentRequest: getAppointmentRequest(),
            recurringPattern: getRecurringPattern()
        };
    };

    const updateErrorIndicators = errorIndicators => setErrors(prevErrors => {return {...prevErrors, ...errorIndicators}});

    const updateAppointmentDetails = modifiedAppointmentDetails => setAppointmentDetails(prevAppointmentDetails => {
        return {...prevAppointmentDetails, ...modifiedAppointmentDetails}
    });

    const isDatelessAppointment = () => {
        return appointmentDetails && appConfig && appConfig.enablePriorityOption && appConfig.prioritiesForDateless && appConfig.prioritiesForDateless.includes(appointmentDetails.priority)
            && !appointmentDetails.appointmentDate && !appointmentDetails.startTime && !appointmentDetails.endTime;
    }

    const isValidAppointment = () => {
        const isValidPatient = appointmentDetails.patient && appointmentDetails.patient.value.uuid;
        const isValidPriority = !isAppointmentPriorityOptionEnabled(appConfig) || appointmentDetails.priority
        updateErrorIndicators({priorityError: !isValidPriority});
        if (isDatelessAppointment()) {
            updateErrorIndicators({
                patientError: !isValidPatient,
                serviceError: !appointmentDetails.service,
                startTimeError: undefined,
                endTimeError: undefined,
                startTimeBeforeEndTimeError: undefined
            });
            return isValidPatient && appointmentDetails.service && isValidPriority
        } else {
            const startTimeBeforeEndTime = isStartTimeBeforeEndTime(appointmentDetails.startTime, appointmentDetails.endTime);
            updateCommonErrorIndicators(isValidPatient, startTimeBeforeEndTime);
            updateErrorIndicators({appointmentDateError: !appointmentDetails.appointmentDate});
            return isValidPatient && appointmentDetails.service && appointmentDetails.appointmentDate && appointmentDetails.startTime && appointmentDetails.endTime && startTimeBeforeEndTime && isValidPriority;
        }
    };

    const isValidRecurringAppointment = () => {
        const isValidPatient = appointmentDetails.patient && appointmentDetails.patient.value.uuid;
        const startTimeBeforeEndTime = isStartTimeBeforeEndTime(appointmentDetails.startTime, appointmentDetails.endTime);
        const selectedWeekDays = getSelectedWeekDays(appointmentDetails.weekDays);
        updateCommonErrorIndicators(isValidPatient, startTimeBeforeEndTime);
        updateErrorIndicators({
            recurrencePeriodError: !appointmentDetails.period || appointmentDetails.period < 1,
            endDateTypeError: !appointmentDetails.endDateType,
            weekDaysError: appointmentDetails.recurrenceType === 'WEEK' && isEmpty(selectedWeekDays),
            startDateError: !appointmentDetails.startDateType || !appointmentDetails.recurringStartDate
        });
        if (appointmentDetails.endDateType) {
            updateErrorIndicators({
                endDateError: appointmentDetails.endDateType === "On" && !appointmentDetails.recurringEndDate,
                occurrencesError: appointmentDetails.endDateType === "After" && (!appointmentDetails.occurrences || appointmentDetails.occurrences < 1)
            })
        }
        return isValidPatient && appointmentDetails.service && appointmentDetails.startTime
            && appointmentDetails.endTime && startTimeBeforeEndTime && appointmentDetails.recurrenceType
            && appointmentDetails.period && appointmentDetails.period > 0 && appointmentDetails.recurringStartDate
            && isValidEndDate() && (appointmentDetails.recurrenceType === dayRecurrenceType || !isEmpty(selectedWeekDays));
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

    const setViewDateAndShowSuccessPopup = startDate => {
        const date = startDate ? moment(startDate) : moment();
        setViewDate(date.startOf('day').toDate())
        setShowSuccessPopup(true);
    };

    const setServiceErrorMessageFromResponse = response => {
        response.error && response.error.message ? setServiceErrorMessage(response.error.message)
            : setServiceErrorMessage(errorTranslations.unexpectedServiceErrorMessage);
    };

    const  resetServiceErrorMessage = () => {
        setTimeout(function () {
            setServiceErrorMessage('');
        }, SERVICE_ERROR_MESSAGE_TIME_OUT_INTERVAL);
    };


    const save = async appointmentRequest => {
        setDisableSaveButton(true);
        if (appConfig.enableAppointmentRequests) {
            await checkAndUpdateAppointmentStatus(appointmentRequest, false);
        }
        const response = await saveAppointment(appointmentRequest);
        const status = response.status;
        if (status === 200) {
            setConflicts(undefined);
            setShowEmailWarning((isVirtual(response.data) && !checkPatientEmailAvailability(response.data)));
            setShowEmailNotSentWarning((isVirtual(response.data) && !checkNotificationStatus(response.data)));
            setViewDateAndShowSuccessPopup(response.data.startDateTime);
            if (isAppointmentSMSEnabled) {
                sendSMS(await getPhoneNumber(response.data.patient.uuid, appConfig.smsAttribute), 
                    getAppointmentBookingMessage(response.data, appConfig, intl));
            }
        } else if (response.data && response.data.error) {
            setConflicts(undefined);
            setServiceErrorMessageFromResponse(response.data);
            resetServiceErrorMessage();
        }
        setDisableSaveButton(false);
    };

    const checkPatientEmailAvailability = (appt) => {
        if (appt.extensions && appt.extensions.patientEmailDefined) {
            console.log("appt.extensions.patientEmailDefined: " + appt.extensions.patientEmailDefined);
            return appt.extensions.patientEmailDefined;
        }
        return false;
    }

    const checkNotificationStatus = (appt) => {
        if (appt.extensions && appt.extensions.notificationResults) {
            var success = appt.extensions.notificationResults.filter(nr => nr.medium.toUpperCase() === "EMAIL" && nr.status === "0");
            console.log("appt.extensions.notification result: " + success);
            return success.length > 0;
        }
        return false;
    }

    const checkAndSave = async () => {
        setDisableSaveButton(true);
        if (isValidAppointment()) {
            const appointment = getAppointmentRequest();
            if (isDatelessAppointment()) {
                appointment.status = APPOINTMENT_STATUSES.WaitList
                await save(appointment);
            } else {
                const response = await getAppointmentConflicts(appointment);
                const status = response.status;
                if (status === 204) {
                    await save(appointment);
                } else if (status === 200) {
                    setConflicts(response.data);
                } else if (response.data && response.data.error) {
                    setConflicts(undefined);
                    setServiceErrorMessageFromResponse(response.data);
                    resetServiceErrorMessage();
                }
            }
        }
        setDisableSaveButton(false);
    };

    const checkAndUpdateAppointmentStatus = async function (appointmentRequest, isRecurring) {
        const appointmentRequestData = isRecurring ? appointmentRequest.appointmentRequest : appointmentRequest;
        await updateAppointmentStatusAndProviderResponse(appointmentDetails, appointmentRequestData, currentProvider.uuid, [], false);
    };

    const saveRecurringAppointments = async recurringAppointmentRequest => {
        setDisableSaveButton(true);
        if (appConfig.enableAppointmentRequests) {
            await checkAndUpdateAppointmentStatus(recurringAppointmentRequest, true);
        }
        const response = await saveRecurring(recurringAppointmentRequest);
        const status = response.status;
        if (status === 200) {
            setConflicts(undefined);
            setServiceErrorMessage('');
            const immediateAppointment = response.data[0];
            setViewDateAndShowSuccessPopup(immediateAppointment.appointmentDefaultResponse.startDateTime);
            if (isAppointmentSMSEnabled) {
                sendSMS(await getPhoneNumber(immediateAppointment.appointmentDefaultResponse.patient.uuid, appConfig.smsAttribute), 
                    getRecurringAppointmentBookingMessage(immediateAppointment, appConfig, intl));
            }
        } else if (status === 204) {
            setServiceErrorMessage(errorTranslations.noContentErrorMessage);
            resetServiceErrorMessage();
        } else if (response.data && response.data.error) {
            setConflicts(undefined);
            setServiceErrorMessageFromResponse(response.data);
            resetServiceErrorMessage();
        }
        setDisableSaveButton(false);
    };



    const checkAndSaveRecurringAppointments = async () => {
        setDisableSaveButton(true);
        if (isValidRecurringAppointment()) {
            const recurringRequest = getRecurringAppointmentRequest();
            const response = await getRecurringAppointmentsConflicts(recurringRequest);
            const status = response.status;
            if (status === 204) {
                await saveRecurringAppointments(recurringRequest);
            } else if (status === 200) {
                setConflicts(response.data);
            } else if (response.data && response.data.error) {
                setConflicts(undefined);
                setServiceErrorMessageFromResponse(response.data);
                resetServiceErrorMessage();
            }
        }
        setDisableSaveButton(false);
    };

    const saveAppointments = () => {
        isRecurringAppointment()
            ? saveRecurringAppointments(getRecurringAppointmentRequest()) : save(getAppointmentRequest());
    };

    const savePopup = <CustomPopup style={customPopup} popupContent={<SuccessConfirmation
      resetAppointmentModal={reInitialiseComponent}
      patientDetails={appointmentDetails.patient && `${appointmentDetails.patient.value.name} (${appointmentDetails.patient.value.identifier})`}
      showEmailWarning={showEmailWarning}
      showEmailNotSentWarning={showEmailNotSentWarning}/>}/>;

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
            updateAppointmentDetails({
                recurringEndDate: undefined,
                recurringStartDate: appointmentDetails.selectedRecurringStartDate
            });
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

    const showAppointmentTypeControl = () => {
        var allowVirtualConsultation = appConfig && appConfig.allowVirtualConsultation;
        if (allowVirtualConsultation) {
            return <AppointmentType appointmentType={appointmentDetails.appointmentType}
                    isTeleconsultation={appointmentDetails.teleconsultation}     
                    onChange={(e) => {
                        if (e) {
                            updateAppointmentDetails({ teleconsultation: e });
                        }
                        if (!e && appointmentDetails.appointmentType === VIRTUAL_APPOINTMENT_TYPE) {
                            updateAppointmentDetails({ appointmentType: undefined });
                        }
                    }} />;

        } else {
            return <div></div>
        }
    };

    const popupContent = <CancelConfirmation {...CANCEL_CONFIRMATION_MESSAGE_ADD} onBack={React.useContext(AppContext).onBack} isFocusLocked={true}/>;

    const closeButton = <div className={classNames(close)}>
        <Close24/>
    </div>

    const on = "On";
    return (<div className={classNames(overlay)}>
            <div data-testid="appointment-editor" className={classNames(appointmentEditor, appointmentDetails.appointmentType === RECURRING_APPOINTMENT_TYPE ? isRecurring : '')}>
                <CustomPopup triggerComponent={closeButton} popupContent={popupContent} style={customPopup}/>
            <AppointmentEditorCommonFieldsWrapper appointmentDetails={appointmentDetails}
                updateAppointmentDetails={updateAppointmentDetails}
                updateErrorIndicators={updateErrorIndicators}
                endTimeBasedOnService={endTimeBasedOnService}
                appConfig={appConfig} errors={errors} autoFocus={true} setSelectedPriority={setSelectedPriority}/>
            <div data-testid="recurring-plan-checkbox">
                <div className={classNames(appointmentPlanContainer)}>
                    <ContentSwitcher selectedIndex={0} onChange={(e) => {
                        if (appointmentDetails.appointmentType === e.name) {
                            updateAppointmentDetails({ appointmentType: undefined });
                        } else {
                            updateAppointmentDetails({ appointmentType: e.name });
                        }
                        if (e.index === 1) {
                            updateAppointmentDetails({ teleconsultation: false});
                        }
                    }}>
                        <Switch name="Regular" >Regular Appointment</Switch>
                        <Switch name="Recurring" disabled={true}>Recurring Appointment</Switch>
                    </ContentSwitcher>
                </div>
            </div>
            <div data-testid="appointment-type-checkbox" className={classNames(teleconsultation)}>
                    {showAppointmentTypeControl()}
            </div>
            <div>
                {isRecurringAppointment() ?
                    <div className={classNames(recurringContainerLeft, recurringContainer)}>
                        <div data-testid="start-date-group">
                            <div className={classNames(dateHeading)}>
                                <Label translationKey="STARTS_LABEL" defaultValue="Starts"/>
                            </div>
                            <StartDateRadioGroup
                                onChange={event => startDateOnChange(event.target.value)}
                                startDateType={appointmentDetails.startDateType}/>
                            <AppointmentDatePicker
                                onChange={date => {
                                    updateAppointmentDetails({
                                        recurringStartDate: date,
                                        selectedRecurringStartDate: date
                                    });
                                    !date.isBefore(appointmentDetails.recurringEndDate) && updateAppointmentDetails({recurringEndDate: undefined});
                                    updateErrorIndicators({startDateError: !date});
                                }}
                                isDisabled={ appointmentDetails.startDateType !==FROM }
                                value={appointmentDetails.startDateType === FROM ? appointmentDetails.selectedRecurringStartDate : appointmentDetails.recurringStartDate}
                                minDate={moment()}/>
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
                                    updateAppointmentDetails({recurringEndDate: date!=='' && !isNil(date)
                                            ? moment(date).endOf('day') : undefined});
                                    updateErrorIndicators({endDateError: !date});
                                }}
                                isDisabled={appointmentDetails.endDateType !== on || (appointmentDetails.endDateType === on && isNil(appointmentDetails.recurringStartDate))}
                                value={appointmentDetails.recurringEndDate}
                                minDate={appointmentDetails.recurringStartDate}/>
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
                                    <TimeSelector {...appointmentStartTimeProps(appointmentDetails.startTime)}
                                                  onChange={time => {
                                                      updateAppointmentDetails({startTime: time});
                                                      endTimeBasedOnService(time, appointmentDetails.service && appointmentDetails.service.value,
                                                          appointmentDetails.serviceType && appointmentDetails.serviceType.value);
                                                      updateErrorIndicators({startTimeError: !time});
                                                  }}/>
                                    <ErrorMessage message={errors.startTimeError ? errorTranslations.timeErrorMessage : undefined}/>
                                </div>
                                <div data-testid="end-time-selector">
                                    <TimeSelector {...appointmentEndTimeProps(appointmentDetails.endTime)}
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
                    <div className={classNames(tableWrapper)}>
                    <table>
                        <tr>
                            <td>
                                <div data-testid="date-selector">
                                    <DatePickerCarbon
                                        value={appointmentDetails.appointmentDate}
                                        onChange={date => {
                                            if(date.length > 0) {
                                                const selectedDate = moment(date[0]).toDate();
                                                updateAppointmentDetails({appointmentDate: selectedDate});
                                            } else {
                                                updateAppointmentDetails({appointmentDate: null});
                                            }
                                            updateErrorIndicators({appointmentDateError: !date[0]});
                                        }}
                                        labelText={"Appointment date"}/>
                                    <ErrorMessage message={errors.appointmentDateError ? errorTranslations.dateErrorMessage : undefined}/>
                                </div>
                            </td>
                            <td/>
                        </tr>
                        <tr>
                            <td>
                                <div data-testid="start-time-selector">
                                    <TimeSelector {...appointmentStartTimeProps(appointmentDetails.startTime)}
                                                  onChange={time => {
                                                      if(time && !time.isValid()) {
                                                        updateAppointmentDetails({startTime: null});
                                                        updateErrorIndicators({startTimeError: true});
                                                      }
                                                      else {
                                                        updateAppointmentDetails({startTime: time});
                                                        endTimeBasedOnService(time, appointmentDetails.service && appointmentDetails.service.value,
                                                            appointmentDetails.serviceType && appointmentDetails.serviceType.value);
                                                        updateErrorIndicators({startTimeError: !time});
                                                      }
                                                  }}/>
                                    {
                                        errors.startTimeError ?
                                            <ErrorMessage message={errors.startTimeError ? errorTranslations.timeErrorMessage : undefined}/> :<ErrorMessage
                                                message={appointmentDetails.startTime && appointmentDetails.endTime && errors.startTimeBeforeEndTimeError ? errorTranslations.startTimeLessThanEndTimeMessage : undefined}/>
                                    }
                                </div>
                            </td>
                            <td>
                                <div data-testid="end-time-selector">
                                    <TimeSelector {...appointmentEndTimeProps(appointmentDetails.endTime)}
                                                  onChange={time => {
                                                      if(time && !time.isValid()) {
                                                        updateAppointmentDetails({endTime: null});
                                                        updateErrorIndicators({endTimeError: true});
                                                      }
                                                      else {
                                                          updateAppointmentDetails({endTime: time});
                                                          updateErrorIndicators({
                                                              startTimeBeforeEndTimeError: !isStartTimeBeforeEndTime(appointmentDetails.startTime, time),
                                                              endTimeError: !time
                                                          });
                                                      }
                                                  }}/>
                                    <ErrorMessage message={errors.endTimeError ? errorTranslations.timeErrorMessage : undefined}/>
                                </div>
                            </td>

                        </tr>
                    </table>
                    </div>
                }
            </div>
                <div data-testid={"appointment-notes"}>
                    <AppointmentNotes value={appointmentDetails.notes} onChange={(event) => updateAppointmentDetails({notes: event.target.value})}/>
                </div>
            {showSuccessPopup ? React.cloneElement(savePopup, {
                open: true,
                closeOnDocumentClick: false,
                closeOnEscape: false
            }) : undefined}
        </div>
        <div  data-testid="Appointment-editer-footer">
            <AppointmentEditorFooter
                errorMessage={serviceErrorMessage}
                checkAndSave={isRecurringAppointment() ? checkAndSaveRecurringAppointments : checkAndSave}
                cancelConfirmationMessage={CANCEL_CONFIRMATION_MESSAGE_ADD}
                disableSaveAndUpdateButton={disableSaveButton}
            />
        </div>
        {conflicts &&
                <div>
                    <Conflicts saveAnyway={saveAppointments}
                            modifyInformation={() => setConflicts(undefined)}
                            conflicts={conflicts} service={appointmentDetails.service}
                            disableSaveAnywayButton={disableSaveButton}
                            isRecurring={appointmentDetails.isRecurring}/>
                </div>}
    </div>);
};

AddAppointment.propTypes = {
    intl: PropTypes.object.isRequired,
    appConfig: PropTypes.object,
    appointmentParams: PropTypes.object,
    currentProvider: PropTypes.object,
    urlParams: PropTypes.object,
    isAppointmentSMSEnabled: PropTypes.bool
};

export const isVirtual = (appt) => {
    return appt.appointmentKind === VIRTUAL_APPOINTMENT_TYPE;
}

export default injectIntl(AddAppointment);
