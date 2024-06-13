import React, {Fragment, useEffect, useState} from "react";
import classNames from 'classnames';
import {
    appointmentEditor,
    appointmentPlanContainer,
    isRecurring,
    teleconsultation,
    overlay,
    close,
    firstBlock,
    recurringContainerBlock,
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
import TimeSelector from "../TimeSelector/TimeSelector.jsx";
import AppointmentNotes from "../AppointmentNotes/AppointmentNotes.jsx";
import AppointmentType from "../AppointmentType/AppointmentType.jsx";
import CustomPopup from "../CustomPopup/CustomPopup.jsx";
import SuccessConfirmation from "../SuccessModal/SuccessModal.jsx";
import {AppContext} from "../AppContext/AppContext";
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
    RECURRENCE_TERMINATION_AFTER,
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
import DatePickerCarbon from "../DatePickerCarbon/DatePickerCarbon.jsx";
import { Close24 } from '@carbon/icons-react';
import { ContentSwitcher, Switch, RadioButtonGroup, RadioButton } from 'carbon-components-react';
import '../../carbon-conflict-fixes.scss';
import '../../carbon-theme.scss';
import './AddAppointment.module.scss';
import CancelConfirmation from "../CancelConfirmation/CancelConfirmation.jsx";
import Dropdown from '../DropdownCarbon/Dropdown.jsx'
import {isAppointmentPriorityOptionEnabled, isAppointmentStatusOptionEnabled} from "../../helper";
import NumberInput from "../NumberInput/NumberInputCarbon.jsx";
import Title from "../Title/Title.jsx";
import Notification from "../Notifications/Notifications.jsx";

const AddAppointment = props => {

    const {appConfig, intl, appointmentParams, currentProvider, urlParams, setIsAppointmentModalOpen } = props;
    const {setViewDate} = React.useContext(AppContext);
    const errorTranslations = getErrorTranslations(intl);

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
        endDateType: RECURRENCE_TERMINATION_AFTER,
        recurrenceType: dayRecurrenceType,
        occurrences: undefined,
        period: undefined,
        weekDays: undefined,
        selectedRecurringStartDate: appointmentParams && moment(new Date(appointmentParams.startDateTime)),
        priority: undefined,
        status: undefined
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
        priorityError: false,
        statusError: false
    };

    const initialRequired = {
        patient: true,
        category: true,
        service: true,
        status: true,
        appointmentStartDate: false,
        appointmentStartTime: false,
        appointmentEndTime: false,
        recurringStartDate: true,
        recurringStartTime: true,
        recurringEndTime: true,
        repeatsEvery: true,
        ends: true,
        repeatsOn: true,
    }

    const [appointmentDetails, setAppointmentDetails] = useState(initialAppointmentState);
    const [appointmentTouched, setAppointmentTouched] = useState("not-ready");
    const [showEmailWarning, setShowEmailWarning] = useState(false);
    const [showEmailNotSentWarning, setShowEmailNotSentWarning] = useState(false);
    const [conflicts, setConflicts] = useState();
    const [errors, setErrors] = useState(initialErrorsState);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [serviceErrorMessage, setServiceErrorMessage] = useState('');
    const [disableSaveButton, setDisableSaveButton] = useState(false);
    const [requiredFields, setRequiredFields] = useState(initialRequired);

    useEffect(()=>{
        setAppointmentTouched((prevState)=>{
            if(prevState === "pristine"){
                return "touched";
            }
            else if(prevState === "ready"){
                return "pristine";
            }
            else {
                return prevState
            }
        })
    }, [appointmentDetails])
    const on = intl.formatMessage({
        id: 'ON_LABEL', defaultMessage: 'On'
    });
    const after = intl.formatMessage({
        id: 'AFTER_LABEL', defaultMessage: 'After'
    });
    const repeatsEvery = intl.formatMessage({id: 'REPEATS_EVERY_LABEL', defaultMessage: "Repeats Every"});
    const ends = intl.formatMessage({id: "ENDS_LABEL", defaultMessage: "Ends"});
    const statusPlaceHolder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_CREATE_APPOINTMENT_STATUS', defaultMessage: "Appointment status"
    });
    const scheduledPlaceHolder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_STATUS_SCHEDULED', defaultMessage: "Scheduled"
    });
    const waitListPlaceHolder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_STATUS_WAITLIST', defaultMessage: "Waitlist"
    });
    const repeatsOn = intl.formatMessage({
        id: 'REPEATS_ON_LABEL', defaultMessage: "Repeats on"
    });
    const successMessage = intl.formatMessage({
        id:'APPOINTMENT_CREATED_MESSAGE', defaultMessage:"Appointment Created!"
    })

    const statusTitleText = <Title text={statusPlaceHolder} isRequired={requiredFields.status}/>

    const recurringTypeOptions = [
        {label: "Day(s)", value: "DAY"},
        {label: "Week(s)", value: "WEEK"}
    ];

    useEffect(() => {
        if (appointmentDetails.occurrences === undefined)
            updateAppointmentDetails({occurrences: getDefaultOccurrences(appConfig)});
        updateAppointmentDetails({weekDays: getWeekDays(appConfig && appConfig.startOfWeek)});
        if(urlParams && urlParams.patient) {
            populatePatientDetails(urlParams.patient).then();
        }
        setAppointmentTouched("ready");
    }, [appConfig]);

    async function populatePatientDetails(patientUuid) {
        const patient = await patientApi.getPatient(patientUuid);
        const patientForDropdown = mapOpenMRSPatient(patient);
        return updateAppointmentDetails({patient: patientForDropdown});
    }

    const reInitialiseComponent = () => {
        setAppointmentTouched("ready");
        updateAppointmentDetails({
            ...initialAppointmentState,
            weekDays: getWeekDays(appConfig && appConfig.startOfWeek)
        });
        updateErrorIndicators(initialErrorsState);
        setConflicts(undefined);
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
            status: appointmentDetails.status || null
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
    const updateRequired = modifiedRequiredList => setRequiredFields(prevRequiredList => {
        return {...prevRequiredList, ...modifiedRequiredList}
    });

    const isValidAppointment = () => {
        const isValidPatient = appointmentDetails.patient && appointmentDetails.patient.value.uuid;
        const isValidPriority = !isAppointmentPriorityOptionEnabled(appConfig) || appointmentDetails.priority
        updateErrorIndicators({priorityError: !isValidPriority});
        const isValidStatus = !isAppointmentStatusOptionEnabled(appConfig) || appointmentDetails.status
        updateErrorIndicators({statusError: !isValidStatus});
        if (appointmentDetails.status === APPOINTMENT_STATUSES.WaitList) {
            updateErrorIndicators({
                patientError: !isValidPatient,
                serviceError: !appointmentDetails.service,
                appointmentDateError: undefined,
                startTimeError: undefined,
                endTimeError: undefined,
                startTimeBeforeEndTimeError: undefined
            });
            return isValidPatient && appointmentDetails.service && isValidPriority && isValidStatus
        } else {
            const startTimeBeforeEndTime = isStartTimeBeforeEndTime(appointmentDetails.startTime, appointmentDetails.endTime);
            updateCommonErrorIndicators(isValidPatient, startTimeBeforeEndTime);
            updateErrorIndicators({appointmentDateError: !appointmentDetails.appointmentDate});
            return isValidPatient && appointmentDetails.service && appointmentDetails.appointmentDate && appointmentDetails.startTime && appointmentDetails.endTime && startTimeBeforeEndTime && isValidPriority && isValidStatus;
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
            startDateError: !appointmentDetails.recurringStartDate
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
        setIsAppointmentModalOpen(false);
        reInitialiseComponent();
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
            if (appointment.status === APPOINTMENT_STATUSES.WaitList) {
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
                        updateAppointmentDetails({ teleconsultation: e });
                    }} />;

        } else {
            return <div></div>
        }
    };

    const handleStatusChange = value => {
        updateAppointmentDetails({status: value});
        errors.statusError && value && updateErrorIndicators({statusError: !value});
        if(value === APPOINTMENT_STATUSES.WaitList) {
            updateAppointmentDetails({appointmentDate: null, startTime: null, endTime: null});
            updateErrorIndicators({
                appointmentDateError: undefined,
                startTimeError: undefined,
                startTimeBeforeEndTimeError: undefined,
                endTimeError: undefined
            });
            updateRequired({appointmentStartDate: false, appointmentStartTime: false, appointmentEndTime: false});
        }
        else{
            updateRequired({appointmentStartDate: true, appointmentStartTime: true, appointmentEndTime: true});
        }
    }

    const closeButton = <div className={classNames(close)}>
        <Close24/>
    </div>
    if(showSuccessPopup){
        return <Notification showMessage={showSuccessPopup} title={successMessage} onClose={React.useContext(AppContext).onBack}/>
    }
    return (<div className={classNames(overlay)}>
            <div data-testid="appointment-editor" className={classNames(appointmentEditor, appointmentDetails.appointmentType === RECURRING_APPOINTMENT_TYPE ? isRecurring : '')}>
                <CancelConfirmation onBack={React.useContext(AppContext).onBack} triggerComponent={closeButton} skipConfirm={appointmentTouched !== "touched"}/>
                <AppointmentEditorCommonFieldsWrapper appointmentDetails={appointmentDetails}
                updateAppointmentDetails={updateAppointmentDetails}
                updateErrorIndicators={updateErrorIndicators}
                endTimeBasedOnService={endTimeBasedOnService}
                appConfig={appConfig} errors={errors} autoFocus={true} requiredFields={requiredFields}/>
            <div data-testid="recurring-plan-checkbox">
                <div className={classNames(appointmentPlanContainer)}>
                    <ContentSwitcher selectedIndex={isRecurringAppointment() ? 1: 0} onChange={(e) => {
                        if (appointmentDetails.appointmentType === e.name) {
                            updateAppointmentDetails({ appointmentType: undefined });
                        } else {
                            updateAppointmentDetails({ appointmentType: e.name });
                        }
                    }}>
                        <Switch name="Regular" text={intl.formatMessage({id: 'REGULAR_APPOINTMENT_LABEL', defaultMessage: "Regular Appointment"})}/>
                        <Switch name="Recurring" text={intl.formatMessage({id: 'RECURRING_APPOINTMENT_LABEL', defaultMessage: "Recurring Appointment"})}/>
                    </ContentSwitcher>
                </div>
            </div>
            <div data-testid="appointment-type-checkbox" className={classNames(teleconsultation)}>
                    {showAppointmentTypeControl()}
            </div>
            <div>
                {isRecurringAppointment() ?
                    //Recurring Appointments
                    <div>
                        <div data-testid="recurring-start-date-selector">
                            <DatePickerCarbon
                                value={appointmentDetails.appointmentDate}
                                onChange={date => {
                                    if(date.length > 0) {
                                        const selectedDate = moment(date[0]).toDate();
                                        updateAppointmentDetails({
                                            recurringStartDate: selectedDate,
                                            selectedRecurringStartDate: selectedDate
                                        });
                                        !moment(date[0]).isBefore(appointmentDetails.recurringEndDate) && updateAppointmentDetails({recurringEndDate: undefined});
                                        updateErrorIndicators({startDateError: !selectedDate});
                                    } else {
                                        updateAppointmentDetails({recurringStartDate: null, selectedRecurringStartDate: null});
                                    }
                                }}
                                minDate={moment().format("MM-DD-YYYY")}
                                isRequired={requiredFields.recurringStartDate}
                                title={"Appointment start date"}/>
                            <ErrorMessage message={errors.startDateError ? errorTranslations.dateErrorMessage : undefined}/>
                        </div>
                        <div style={{display: "flex"}}>
                            <span style={{marginRight: "5px"}} data-testid="recurring-start-time-selector">
                                <TimeSelector
                                    {...appointmentStartTimeProps(appointmentDetails.startTime)}
                                    onChange={time => {
                                        if(time && !time.isValid()) {
                                            updateAppointmentDetails({startTime: null});
                                            updateErrorIndicators({startTimeError: true});
                                        }
                                        else{
                                            updateAppointmentDetails({startTime: time});
                                            endTimeBasedOnService(time, appointmentDetails.service && appointmentDetails.service.value,
                                                appointmentDetails.serviceType && appointmentDetails.serviceType.value);
                                            updateErrorIndicators({startTimeError: !time});
                                        }
                                    }}
                                    isRequired={requiredFields.recurringStartTime}
                                />
                                <ErrorMessage message={errors.startTimeError ? errorTranslations.timeErrorMessage : undefined}/>
                            </span>
                            <span data-testid="recurring-end-time-selector">
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
                                              }}
                                              isRequired={requiredFields.recurringEndTime}
                                              />
                                { errors.endTimeError ?
                                    <ErrorMessage message={errors.endTimeError ? errorTranslations.timeErrorMessage : undefined}/> :
                                    <ErrorMessage
                                        message={appointmentDetails.startTime && appointmentDetails.endTime && errors.startTimeBeforeEndTimeError ? errorTranslations.startTimeLessThanEndTimeMessage : undefined}/>
                                }
                            </span>
                        </div>
                        <div>
                            <div className={classNames(recurringContainerBlock)}>
                                <div style={{width: "120px", marginRight: "5px"}}>
                                    <NumberInput
                                        testId={"appointment-period"}
                                        onChange={value => {
                                            updateAppointmentDetails({period: value});
                                            updateErrorIndicators({recurrencePeriodError: !value});
                                        }}
                                        value={appointmentDetails.period || 0}
                                        id={"period"}
                                        label={repeatsEvery}
                                        isRequired={requiredFields.repeatsEvery}
                                    />
                                </div>
                                <div style={{minWidth: "120px", verticalAlign: "bottom"}}>
                                    <Dropdown id={"recurrence-type"} options={recurringTypeOptions}
                                              label={"Choose an option"}
                                              selectedValue={recurringTypeOptions[0]}
                                              onChange={event => {
                                                  updateAppointmentDetails({recurrenceType: event.selectedItem.value});
                                                  updateErrorIndicators({weekDaysError: errors.weekDaysError && event.selectedItem.value.toUpperCase() === 'WEEK'});
                                              }}
                                    />
                                </div>
                                <br/>
                                <ErrorMessage message={errors.recurrencePeriodError && errorTranslations.recurrencePeriodErrorMessage}/>
                            </div>
                            { appointmentDetails.recurrenceType === "WEEK" ?
                                <div className={classNames(recurringContainerBlock)}>
                                    <div>
                                        <ButtonGroup buttonsList={appointmentDetails.weekDays} onClick={buttonKey => {
                                            const prevWeekDaysMap = new Map(appointmentDetails.weekDays);
                                            const nextEntry = {
                                                ...prevWeekDaysMap.get(buttonKey),
                                                isSelected: !prevWeekDaysMap.get(buttonKey).isSelected
                                            };
                                            prevWeekDaysMap.set(buttonKey, nextEntry);
                                            updateAppointmentDetails({weekDays: prevWeekDaysMap});
                                            updateErrorIndicators({weekDaysError: false});
                                        }}
                                        label={repeatsOn}
                                        isRequired={requiredFields.repeatsOn}/>
                                    </div>
                                    <br/>
                                    <ErrorMessage message={errors.weekDaysError && errorTranslations.weekDaysErrorMessage }/>
                                </div>
                                :<Fragment/>}
                            <div className={classNames(recurringContainerBlock)}>
                                <div style={{minWidth: "100px"}}>
                                    <Dropdown id={"recurring-end"} options={[after, on]}
                                              onChange={event => {
                                                  endDateOnChange(event.selectedItem);
                                                  updateErrorIndicators({endDateTypeError: errors.endDateTypeError});
                                              }}
                                              selectedValue={appointmentDetails.endDateType || after}
                                              titleText={ends}
                                              isRequired={requiredFields.ends}
                                    />
                                </div>
                                <div style={{verticalAlign:"middle"}}>
                                    { appointmentDetails.endDateType === on ?
                                        <DatePickerCarbon
                                            onChange={ date => {
                                                if(date.length > 0) {
                                                    const selectedDate = moment(date[0]).toDate();
                                                    updateAppointmentDetails({recurringEndDate: selectedDate !==' ' && !isNil(date)
                                                            ? moment(date[0]).endOf('day') : undefined})
                                                    updateErrorIndicators({endDateError: !selectedDate});
                                                } else {
                                                    updateAppointmentDetails({recurringStartDate: null, selectedRecurringStartDate: null});
                                                }
                                            }}
                                            width={"160px"}
                                            minDate = { (appointmentDetails.recurringStartDate && moment(appointmentDetails.recurringStartDate).format("MM-DD-YYYY"))
                                                || moment().format("MM-DD-YYYY")}
                                            testId={"recurring-end-date-selector"}/>:
                                        <div className={classNames(recurringContainerBlock)}>
                                            <div style={{width: "140px", marginRight: "5px"}}>
                                                <NumberInput id={'occurrences'}
                                                             testId={"recurring-occurrences"}
                                                             value={appointmentDetails.occurrences}
                                                             onChange = {value => {
                                                                 updateAppointmentDetails({occurrences: value});
                                                                 updateErrorIndicators({occurrencesError: !value})
                                                             }}
                                                />
                                            </div>
                                            <div style={{ padding: "0 8px"}}><Label translationKey="OCCURRENCES_LABEL" defaultValue="Occurrences"/></div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className={classNames(recurringContainerBlock)}>
                                <div className={classNames(firstBlock)}>&nbsp;</div>
                                {
                                    appointmentDetails.endDateType === on ?
                                        <ErrorMessage message={ getEndDateTypeErrorMessage() } /> :
                                        <ErrorMessage message={ errors.occurrencesError && errorTranslations.occurrencesErrorMessage}/>
                                }
                            </div>
                        </div>
                    </div>:
                    //Regular Appointments
                    <div >
                        {isAppointmentStatusOptionEnabled(appConfig) && 
                            <div data-testid="appointment-status">
                                <RadioButtonGroup
                                    legendText={statusTitleText}
                                    name="appointment-status-option"
                                    valueSelected={appointmentDetails.status || null}
                                    onChange={handleStatusChange}
                                    >
                                    <RadioButton
                                        labelText={scheduledPlaceHolder}
                                        value={APPOINTMENT_STATUSES.Scheduled}
                                        id={APPOINTMENT_STATUSES.Scheduled}
                                    />
                                    <RadioButton
                                        labelText={waitListPlaceHolder}
                                        value={APPOINTMENT_STATUSES.WaitList}
                                        id={APPOINTMENT_STATUSES.WaitList}
                                    />
                                </RadioButtonGroup>
                                <ErrorMessage message={errors.statusError ? errorTranslations.statusErrorMessage : undefined}/>
                            </div>}
                        <div data-testid="date-selector">
                            <DatePickerCarbon
                                value={appointmentDetails.appointmentDate}
                                isDisabled={appointmentDetails.status === APPOINTMENT_STATUSES.WaitList && !!appConfig.disableDatesForWaitListAppointment}
                                onChange={date => {
                                    if(date.length > 0) {
                                        const selectedDate = moment(date[0]).toDate();
                                        updateAppointmentDetails({appointmentDate: selectedDate});
                                    } else {
                                        updateAppointmentDetails({appointmentDate: null});
                                    }
                                    !appConfig.prioritiesForDateless.
                                    find((priority) => priority === appointmentDetails.priority) &&
                                    updateErrorIndicators({appointmentDateError: !date[0]});
                                }}
                                minDate={moment().format("MM-DD-YYYY")}
                                isRequired={requiredFields.appointmentStartDate}
                                title={"Appointment date"}/>
                            <ErrorMessage message={errors.appointmentDateError ? errorTranslations.dateErrorMessage : undefined}/>
                        </div>
                        <div style={{display: "flex"}}>
                            <div style={{marginRight: "5px"}} data-testid="start-time-selector">
                            <TimeSelector {...appointmentStartTimeProps(appointmentDetails.startTime)}
                                        isDisabled={appointmentDetails.status === APPOINTMENT_STATUSES.WaitList && !!appConfig.disableDatesForWaitListAppointment}
                                        isRequired={requiredFields.appointmentStartTime}
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
                            <ErrorMessage message={errors.startTimeError ? errorTranslations.timeErrorMessage : undefined}/>
                            </div>
                            <div data-testid="end-time-selector">
                                <TimeSelector {...appointmentEndTimeProps(appointmentDetails.endTime)}
                                            isRequired={requiredFields.appointmentEndTime}
                                            isDisabled={appointmentDetails.status === APPOINTMENT_STATUSES.WaitList && !!appConfig.disableDatesForWaitListAppointment}
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
                                {
                                    errors.endTimeError ? <ErrorMessage message={errors.endTimeError ? errorTranslations.timeErrorMessage : undefined}/> : <ErrorMessage
                                        message={appointmentDetails.startTime && appointmentDetails.endTime && errors.startTimeBeforeEndTimeError ? errorTranslations.startTimeLessThanEndTimeMessage : undefined}/>
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
                <div data-testid={"appointment-notes"}>
                    <AppointmentNotes value={appointmentDetails.notes} onChange={(event) => updateAppointmentDetails({notes: event.target.value})}/>
                </div>
            {showSuccessPopup && ( showEmailWarning || showEmailNotSentWarning ) ? React.cloneElement(savePopup, {
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
                skipConfirm={appointmentTouched !== "touched"}
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
    setIsAppointmentModalOpen: PropTypes.func
};

export const isVirtual = (appt) => {
    return appt.appointmentKind === VIRTUAL_APPOINTMENT_TYPE;
}

export default injectIntl(AddAppointment);
