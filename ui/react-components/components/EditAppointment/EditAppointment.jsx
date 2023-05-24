import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {injectIntl} from "react-intl";
import {filter, isEqual, isNil} from "lodash";
import classNames from "classnames";
import {
    appointmentEditor,
    appointmentPlanContainer,
    dateHeading,
    teleconsultation,
    overlay,
    recurringContainerBlock,
    firstBlock,
    close
} from "../AddAppointment/AddAppointment.module.scss";
import {conflictsPopup, customPopup} from "../CustomPopup/CustomPopup.module.scss";
import AppointmentEditorCommonFieldsWrapper
    from "../AppointmentEditorCommonFieldsWrapper/AppointmentEditorCommonFieldsWrapper.jsx";
import {getRecurringAppointment} from "../../api/recurringAppointmentsApi";
import {getAppointment} from "../../api/appointmentsApi";
import {getPatientForDropdown} from "../../mapper/patientMapper";
import moment from "moment";
import 'moment-timezone';
import {getDuration, getValidProviders, isActiveProvider} from "../../helper";
import {
    appointmentEndTimeProps,
    appointmentStartTimeProps,
    CANCEL_CONFIRMATION_MESSAGE_EDIT,
    MINUTES,
    PROVIDER_RESPONSES,
    RECURRENCE_TERMINATION_AFTER,
    RECURRENCE_TERMINATION_ON,
    RECURRING_APPOINTMENT_TYPE,
    SCHEDULED_APPOINTMENT_TYPE,
    SERVICE_ERROR_MESSAGE_TIME_OUT_INTERVAL,
    WALK_IN_APPOINTMENT_TYPE,
    weekRecurrenceType,
    TELECONSULTATION_APPOINTMENT,
    VIRTUAL_APPOINTMENT_TYPE, CANCEL_CONFIRMATION_MESSAGE_ADD
} from "../../constants";
import AppointmentPlan from "../AppointmentPlan/AppointmentPlan.jsx";
import AppointmentType from "../AppointmentType/AppointmentType.jsx";
import Label from "../Label/Label.jsx";
import {
    currentTimeSlot,
    dateText,
    editAppointment,
    recurringDetailsEdit,
    recurringEndDateContainer,
    recurringEndDateLabel,
    recurringTerminationDetails,
    weekDaySelector
} from './EditAppointment.module.scss'
import TimeSelector from "../TimeSelector/TimeSelector.jsx";
import InputNumber from "../InputNumber/InputNumber.jsx";
import ButtonGroup from "../ButtonGroup/ButtonGroup.jsx";
import {getSelectedWeekDays, getWeekDays, selectWeekDays} from "../../services/WeekDaysService/WeekDaysService";
import AppointmentNotes from "../AppointmentNotes/AppointmentNotes.jsx";
import AppointmentEditorFooter from "../AppointmentEditorFooter/AppointmentEditorFooter.jsx";
import {getProviderDropDownOptions} from "../../mapper/providerMapper";
import CalendarPicker from "../CalendarPicker/CalendarPicker.jsx";
import AppointmentDatePicker from "../DatePicker/DatePicker.jsx";
import {capitalize} from "lodash/string";
import CustomPopup from "../CustomPopup/CustomPopup.jsx";
import Conflicts from "../Conflicts/Conflicts.jsx";
import {
    getAppointmentConflicts,
    getRecurringAppointmentsConflicts,
    saveAppointment,
    updateRecurring
} from "../../services/AppointmentsService/AppointmentsService";
import {getDateTime, isStartTimeBeforeEndTime} from "../../utils/DateUtil";
import {getAppointmentBookingMessage, getRecurringAppointmentBookingMessage, getPhoneNumber} from '../../utils/AppointmentSMS.js'
import UpdateSuccessModal from "../SuccessModal/UpdateSuccessModal.jsx";
import UpdateConfirmationModal from "../UpdateConfirmationModal/UpdateConfirmationModal.jsx";
import {getComponentsDisableStatus} from "./ComponentsDisableStatus";
import ErrorMessage from "../ErrorMessage/ErrorMessage.jsx";
import {getErrorTranslations} from "../../utils/ErrorTranslationsUtil";
import {AppContext} from "../AppContext/AppContext";
import updateAppointmentStatusAndProviderResponse from "../../appointment-request/AppointmentRequest";
import {sendSMS} from "../../api/smsService";
import CancelConfirmation from "../CancelConfirmation/CancelConfirmation.jsx";
import {Close20} from "@carbon/icons-react";
import {ContentSwitcher, Switch} from "carbon-components-react";
import DatePickerCarbon from "../DatePickerCarbon/DatePickerCarbon.jsx";
import NumberInputCarbon from "../NumberInput/NumberInputCarbon.jsx";
import Dropdown from "../DropdownCarbon/Dropdown.jsx";

const EditAppointment = props => {

    const {appConfig, appointmentUuid, isRecurring, intl, currentProvider, isAppointmentSMSEnabled} = props;

    const {setViewDate} = React.useContext(AppContext);

    const [errors, setErrors] = useState({
        serviceError: false,
        appointmentDateError: false,
        endDateError: false,
        occurrencesError: false,
        startTimeError: false,
        endTimeError: false,
        recurrencePeriodError: false,
        startTimeBeforeEndTimeError: false
    });

    const initialAppointmentState = {
        patient: undefined,
        providers: [],
        service: undefined,
        serviceType: undefined,
        location: undefined,
        speciality: undefined,
        appointmentDate: undefined,
        startTime: undefined,
        endTime: undefined,
        appointmentKind: undefined,
        appointmentType: isRecurring === 'true' ? RECURRING_APPOINTMENT_TYPE : undefined,
        status: undefined,
        recurringEndDate: undefined,
        notes: undefined,
        recurrenceType: undefined,
        occurrences: undefined,
        period: undefined,
        weekDays: undefined,
        endDateType: undefined,
        teleconsultation:undefined,
        priority: undefined,
    };

    const [appointmentDetails, setAppointmentDetails] = useState(initialAppointmentState);
    const [conflicts, setConflicts] = useState();
    const [showUpdateConfirmPopup, setShowUpdateConfirmPopup] = useState(false);
    const [showUpdateSuccessPopup, setShowUpdateSuccessPopup] = useState(false);
    const [currentStartTime, setCurrentStartTime] = useState();
    const [currentEndTime, setCurrentEndTime] = useState();
    const [originalAppointmentDate, setOriginalAppointmentDate] = useState(undefined);
    const [originalRecurringEndDate, setOriginalRecurringEndDate] = useState(undefined);
    const [originalOccurrences, setOriginalOccurrences] = useState(undefined);
    const [applyForAll, setApplyForAll] = useState(false);
    const [serviceErrorMessage, setServiceErrorMessage] = useState('');
    const [existingProvidersUuids, setExistingProvidersUuids] = useState([]);
    const [appointmentTimeBeforeEdit, setAppointmentTimeBeforeEdit] = useState({});
    const [disableUpdateButton, setDisableUpdateButton] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState({})

    const after = intl.formatMessage({
        id: 'AFTER_LABEL', defaultMessage: 'After'
    });

    const on = intl.formatMessage({
        id: 'ON_LABEL', defaultMessage: 'On'
    });

    const isRecurringAppointment = () => appointmentDetails.appointmentType === RECURRING_APPOINTMENT_TYPE;
    const isWalkInAppointment = () => appointmentDetails.appointmentType === WALK_IN_APPOINTMENT_TYPE;
    const [componentsDisableStatus, setComponentsDisableStatus] = useState({});

    const errorTranslations = getErrorTranslations(intl);

    const updateErrorIndicators = errorIndicators => setErrors(prevErrors => {
        return {...prevErrors, ...errorIndicators}
    });
    const isDatelessAppointment = () => {
        return appointmentDetails && appConfig && appConfig.enablePriorityOption && appConfig.prioritiesForDateless && appConfig.prioritiesForDateless.includes(appointmentDetails.priority)
            && !appointmentDetails.appointmentDate && !appointmentDetails.startTime && !appointmentDetails.endTime;
    }

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
    const updateAppointmentDetails = modifiedAppointmentDetails => setAppointmentDetails(prevAppointmentDetails => {
        console.log(modifiedAppointmentDetails);
        return {...prevAppointmentDetails, ...modifiedAppointmentDetails}
    });

    //TODO To be checked if can be moved to common place
    const endTimeBasedOnService = (time, service, serviceType) => {
        const currentTime = moment(time);
        const duration = getDuration(service, serviceType);
        currentTime.add(duration, MINUTES);
        if (time) {
            updateAppointmentDetails({endTime: currentTime});
            updateErrorIndicators({endTimeError: false});
        }
    };

    const saveAppointments = () => {
        if (isRecurringAppointment()) {
            updateAllAppointments(getRecurringAppointmentRequest(applyForAll)).then();
        } else {
            save(getAppointmentRequest()).then();
        }
    };

    const updateSuccessPopup = <CustomPopup style={customPopup} popupContent={<UpdateSuccessModal
        updateSeries={appointmentDetails.appointmentType === RECURRING_APPOINTMENT_TYPE && applyForAll}/>}/>;

    const updateConfirmPopup = <CustomPopup style={customPopup} onClose={() => setShowUpdateConfirmPopup(false)}
                                            popupContent={
                                                <UpdateConfirmationModal
                                                    updateSeries={appointmentDetails.appointmentType === RECURRING_APPOINTMENT_TYPE && applyForAll}
                                                    save={saveAppointments}/>}/>;

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
            uuid: appointmentUuid,
            patientUuid: appointmentDetails.patient && appointmentDetails.patient.value.uuid,
            serviceUuid: appointmentDetails.service && appointmentDetails.service.value.uuid,
            serviceTypeUuid: appointmentDetails.serviceType && appointmentDetails.serviceType.value &&
                appointmentDetails.serviceType.value.uuid,
            startDateTime: getDateTime(appointmentDetails.appointmentDate, appointmentDetails.startTime),
            endDateTime: getDateTime(appointmentDetails.appointmentDate, appointmentDetails.endTime),
            providers: getValidProviders(appointmentDetails.providers),
            locationUuid: appointmentDetails.location && appointmentDetails.location.value && appointmentDetails.location.value.uuid,
            appointmentKind: requestAppointmentType(),
            status: appointmentDetails.status,
            comments: appointmentDetails.notes,
            priority: appointmentDetails.priority
        };
        if (!appointment.serviceTypeUuid || appointment.serviceTypeUuid.length < 1)
            delete appointment.serviceTypeUuid;
        return appointment;
    };

    const getRecurringAppointmentRequest = (applyForAllInd) => {
        return {
            appointmentRequest: getAppointmentRequest(),
            recurringPattern: getRecurringPattern(),
            applyForAll: applyForAllInd,
            timeZone: moment.tz.guess()
        };
    };

    const getRecurringPattern = () => {
        const recurringPattern = {
            type: appointmentDetails.recurrenceType,
            period: appointmentDetails.period
        };
        appointmentDetails.endDateType === "After" ? recurringPattern.frequency = appointmentDetails.occurrences : recurringPattern.endDate = appointmentDetails.recurringEndDate;
        if (isWeeklyRecurringAppointment()) {
            recurringPattern.daysOfWeek = getSelectedWeekDays(appointmentDetails.weekDays);
        }
        return recurringPattern;
    };

    const isWeeklyRecurringAppointment = () => appointmentDetails.recurrenceType === weekRecurrenceType;

    const setServiceErrorMessageFromResponse = response => {
        response.error && response.error.message ? setServiceErrorMessage(response.error.message)
            : setServiceErrorMessage(errorTranslations.unexpectedServiceErrorMessage);
    };

    const resetServiceErrorMessage = () => {
        setTimeout(function () {
            setServiceErrorMessage('');
        }, SERVICE_ERROR_MESSAGE_TIME_OUT_INTERVAL);
    };

    const checkAndSave = async () => {
        if (isValidAppointment()) {
            setDisableUpdateButton(true);
            const appointment = getAppointmentRequest();
            const response = await getAppointmentConflicts(appointment);
            const status = response.status;
            if (status === 204) {
                setShowUpdateConfirmPopup(true);
            } else if (status === 200) {
                setConflicts(response.data);
            } else if (response.data && response.data.error) {
                setConflicts(undefined);
                setServiceErrorMessageFromResponse(response.data);
                resetServiceErrorMessage();
            }
            setDisableUpdateButton(false);
        }
    };

    const setViewDateAndShowSuccessPopup = startDate => {
        const date = startDate ? moment(startDate) : moment();
        setViewDate(date.startOf('day').toDate())
        setShowUpdateSuccessPopup(true);
    };

    const isRescheduled = function (appointmentTimeBeforeEdit) {
        if (!moment(appointmentDetails.appointmentDate).isSame(moment(appointmentTimeBeforeEdit.date))) {
            return true;
        }
        const newStart = moment(appointmentDetails.startTime, 'hh:mm a');
        const previousStart = moment(appointmentTimeBeforeEdit.startTime, 'hh:mm a');
        const newEnd = moment(appointmentDetails.endTime, 'hh:mm a');
        const previousEnd = moment(appointmentTimeBeforeEdit.endTime, 'hh:mm a');

        const isSameStart = newStart.isSame(previousStart, 'minutes');
        const isSameEnd = newEnd.isSame(previousEnd, 'minutes');
        return !(isSameStart && isSameEnd);
    };

    const checkAndUpdateAppointmentStatus = async function (appointmentRequest, isRecurring) {
        const appointmentRequestData = isRecurring ? appointmentRequest.appointmentRequest : appointmentRequest;
        await updateAppointmentStatusAndProviderResponse(appointmentDetails, appointmentRequestData, currentProvider.uuid,
            existingProvidersUuids, isRescheduled(appointmentTimeBeforeEdit));
    };

    const save = async appointmentRequest => {
        setDisableUpdateButton(true);
        if (appConfig.enableAppointmentRequests) {
            await checkAndUpdateAppointmentStatus(appointmentRequest, false);
        }
        const response = await saveAppointment(appointmentRequest);
        const status = response.status;
        if (status === 200) {
            setConflicts(undefined);
            setShowUpdateConfirmPopup(false);
            setViewDateAndShowSuccessPopup(appointmentDetails.appointmentDate);
            if (isAppointmentSMSEnabled) {
                sendSMS(await getPhoneNumber(response.data.patient.uuid, appConfig.smsAttribute), 
                    getAppointmentBookingMessage(response.data, appConfig, intl));
            }
        } else if (response.data && response.data.error) {
            setConflicts(undefined);
            setServiceErrorMessageFromResponse(response.data);
            resetServiceErrorMessage();
        }
        setDisableUpdateButton(false);
    };

    const updateAllAppointments = async recurringAppointmentRequest => {
        setDisableUpdateButton(true);
        if (appConfig.enableAppointmentRequests) {
            await checkAndUpdateAppointmentStatus(recurringAppointmentRequest, true);
        }
        const response = await updateRecurring(recurringAppointmentRequest);
        const status = response.status;
        if (status === 200) {
            setConflicts(undefined);
            setShowUpdateConfirmPopup(false);
            setViewDateAndShowSuccessPopup(appointmentDetails.appointmentDate);
            if (isAppointmentSMSEnabled) {
                sendSMS(await getPhoneNumber(response.data[0].appointmentDefaultResponse.patient.uuid, appConfig.smsAttribute), 
                    getRecurringAppointmentBookingMessage(response.data[0], appConfig, intl));
            }
        } else if (response.data && response.data.error) {
            setConflicts(undefined);
            setServiceErrorMessageFromResponse(response.data);
            resetServiceErrorMessage();
        }
        setDisableUpdateButton(false);
    };

    const checkAndUpdateRecurringAppointments = async (applyForAllInd) => {
        if (isValidRecurringAppointment()) {
            setDisableUpdateButton(true);
            const recurringRequest = getRecurringAppointmentRequest(applyForAllInd);
            const response = applyForAllInd ? await getRecurringAppointmentsConflicts(recurringRequest) :
                await getAppointmentConflicts(recurringRequest.appointmentRequest);
            const status = response.status;
            if (status === 204) {
                setShowUpdateConfirmPopup(true);
            } else if (status === 200) {
                setConflicts(response.data);
            } else if (response.data && response.data.error) {
                setConflicts(undefined);
                setServiceErrorMessageFromResponse(response.data);
                resetServiceErrorMessage();
            }
            setDisableUpdateButton(false);
        }
    };


    const isValidAppointment = () => {
        const startTimeBeforeEndTime = isStartTimeBeforeEndTime(appointmentDetails.startTime, appointmentDetails.endTime);
        updateCommonErrorIndicators(startTimeBeforeEndTime);
        updateErrorIndicators({appointmentDateError: !appointmentDetails.appointmentDate});
        return appointmentDetails.service && appointmentDetails.appointmentDate && appointmentDetails.startTime && appointmentDetails.endTime && startTimeBeforeEndTime;
    };

    const updateCommonErrorIndicators = (startTimeBeforeEndTime) => updateErrorIndicators({
        serviceError: !appointmentDetails.service,
        startTimeError: !appointmentDetails.startTime,
        endTimeError: !appointmentDetails.endTime,
        startTimeBeforeEndTimeError: !startTimeBeforeEndTime,
        appointmentDateError: !appointmentDetails.appointmentDate
    });

    const isValidRecurringAppointment = () => {
        const startTimeBeforeEndTime = isStartTimeBeforeEndTime(appointmentDetails.startTime, appointmentDetails.endTime);

        updateCommonErrorIndicators(startTimeBeforeEndTime);
        updateErrorIndicators({
            recurrencePeriodError: !appointmentDetails.period || appointmentDetails.period < 1
        });
        if (appointmentDetails.endDateType === RECURRENCE_TERMINATION_ON) {
            updateErrorIndicators({
                endDateError: !appointmentDetails.recurringEndDate
            })
        } else {
            updateErrorIndicators({
                occurrencesError: !appointmentDetails.occurrences || appointmentDetails.occurrences < 1
            })
        }
        return appointmentDetails.service && appointmentDetails.startTime && appointmentDetails.endTime && startTimeBeforeEndTime
            && appointmentDetails.appointmentDate && isValidEndDate();
    };

    const isValidEndDate = () => appointmentDetails.recurringEndDate || (appointmentDetails.occurrences && appointmentDetails.occurrences > 0);

    function storePreviousAppointmentDatetime(date, startTime, endTime) {
        setAppointmentTimeBeforeEdit({date: date, startTime: startTime, endTime: endTime});
    }

    function storeExistingProviderUuids(existingProviders) {
        const existingProvidersUuids = filter(existingProviders, isActiveProvider).map(provider => provider.uuid);
        setExistingProvidersUuids(existingProvidersUuids);
    }

    const generateAppointmentDetails = async (callback) => {
        const appointment = isRecurringAppointment()
            ? await getRecurringAppointment(appointmentUuid) : await getAppointment(appointmentUuid);
        const appointmentResponse = isRecurringAppointment()
            ? (appointment && appointment.data && appointment.data.appointmentDefaultResponse) || undefined
            : (appointment && appointment.data) || undefined;
        const recurringPattern = isRecurringAppointment()
            ? (appointment && appointment.data && appointment.data.recurringPattern) || undefined : undefined;
        console.log(appointmentResponse)
        if (appointmentResponse) {
            setOriginalAppointmentDate(moment(new Date(appointmentResponse.startDateTime)));
            const appointmentDetailsFromResponse = {
                patient: getPatientForDropdown(appointmentResponse.patient),
                providers: getProviderDropDownOptions(appointmentResponse.providers),
                service: {label: appointmentResponse.service.name, value: appointmentResponse.service},
                serviceType: appointmentResponse.serviceType ? {label: appointmentResponse.serviceType.name, value: appointmentResponse.serviceType} : undefined,
                location: appointmentResponse.location ? {label: appointmentResponse.location.name, value: appointmentResponse.location} : undefined,
                speciality: appointmentResponse.service.speciality.uuid ? {label: appointmentResponse.service.speciality.name, value: appointmentResponse.service.speciality} : undefined,
                startTime: moment(new Date(appointmentResponse.startDateTime)),
                endTime: moment(new Date(appointmentResponse.endDateTime)),
                notes: appointmentResponse.comments,
                appointmentDate: moment(new Date(appointmentResponse.startDateTime)),
                appointmentKind: appointmentResponse.appointmentKind,
                status: appointmentResponse.status,
                appointmentType: isRecurring === 'true' ? RECURRING_APPOINTMENT_TYPE :
                    appointmentResponse.appointmentKind === WALK_IN_APPOINTMENT_TYPE ? WALK_IN_APPOINTMENT_TYPE : undefined,
                teleconsultation:appointmentResponse.appointmentKind === VIRTUAL_APPOINTMENT_TYPE,
                priority: appointmentResponse.priority
            };
            updateAppointmentDetails(appointmentDetailsFromResponse);
            storePreviousAppointmentDatetime(appointmentDetailsFromResponse.appointmentDate, appointmentDetailsFromResponse.startTime, appointmentDetailsFromResponse.endTime);
            storeExistingProviderUuids(appointmentResponse.providers);
            setCurrentStartTime(moment(new Date(appointmentResponse.startDateTime)).format('hh:mm a'));
            setCurrentEndTime(moment(new Date(appointmentResponse.endDateTime)).format('hh:mm a'));
            if (isRecurringAppointment()) {
                setOriginalRecurringEndDate(recurringPattern.endDate && moment(new Date(recurringPattern.endDate)));
                setOriginalOccurrences(recurringPattern.frequency);
                updateAppointmentDetails({
                    recurrenceType: recurringPattern.type,
                    recurringEndDate: recurringPattern.endDate && moment(new Date(recurringPattern.endDate)),
                    occurrences: recurringPattern.frequency,
                    period: recurringPattern.period,
                    weekDays: recurringPattern.daysOfWeek && selectWeekDays(getWeekDays(appConfig && appConfig.startOfWeek), recurringPattern.daysOfWeek),
                    endDateType: recurringPattern.endDate ? RECURRENCE_TERMINATION_ON : RECURRENCE_TERMINATION_AFTER
                });
            }
        }
        callback(appointmentResponse);
    };

    const isStartDateModified = () => isDateModified(originalAppointmentDate, appointmentDetails.appointmentDate);

    const isEndDateModified = () => isDateModified(originalRecurringEndDate, appointmentDetails.recurringEndDate);

    const isDateModified = (originalDate, modifiedDate) => !isEqual(moment(originalDate).format('DMYYYY'), moment(modifiedDate).format('DMYYYY'));

    const isOccurrencesModified = () => originalOccurrences !== appointmentDetails.occurrences;

    const isApplicableForAll = () => {
       return  !(isStartDateModified() || isEndDateModified() || isOccurrencesModified())
    };

    const updateAppointments = (applyForAllInd) => {
        if (isRecurringAppointment()) {
            if (applyForAllInd === undefined) {
                applyForAllInd = !isStartDateModified();
            }
            setApplyForAll(applyForAllInd);
            checkAndUpdateRecurringAppointments(applyForAllInd).then();
        } else {
            checkAndSave().then();
        }
    };

    const showAppointmentTypeControl = () => {
        var allowVirtualConsultation = appConfig && appConfig.allowVirtualConsultation;
        if (allowVirtualConsultation) {
            return <AppointmentType appointmentType={appointmentDetails.appointmentType}
                        isTeleconsultation={appointmentDetails.teleconsultation}
                        onChange={(e) => {
                            if (e.target.name === TELECONSULTATION_APPOINTMENT) {
                                updateAppointmentDetails({ teleconsultation: e.target.checked });
                                if (e.target.checked && appointmentDetails.appointmentType === WALK_IN_APPOINTMENT_TYPE) {
                                    updateAppointmentDetails({ appointmentType: VIRTUAL_APPOINTMENT_TYPE });
                                }
                                if (!e.target.checked && appointmentDetails.appointmentType === VIRTUAL_APPOINTMENT_TYPE) {
                                    updateAppointmentDetails({ appointmentType: undefined });
                                }
                            }
                        }} />;
        } else {
            return <div></div>
        }
    }

    useEffect(() => {
        const setDisableStatus = (appointmentResponse) => setComponentsDisableStatus(getComponentsDisableStatus(appointmentResponse,
            appConfig && appConfig.isServiceOnAppointmentEditable));
        generateAppointmentDetails(setDisableStatus).then();
    }, [appConfig]);

    const popupContent = <CancelConfirmation {...CANCEL_CONFIRMATION_MESSAGE_ADD} onBack={React.useContext(AppContext).onBack} isFocusLocked={true}/>;

    const closeButton = <div className={classNames(close)}>
        <Close20/>
    </div>

    const endDateOnChange = value => {
        updateAppointmentDetails({endDateType: value});
        updateErrorIndicators({endDateTypeError: false});
        value === "After" && updateErrorIndicators({endDateError: false});
        if (value === "On") {
            updateErrorIndicators({endDateError: appointmentDetails.recurringStartDate && !appointmentDetails.recurringEndDate, occurrencesError: false});
        }
    };
    console.log("appointmentDetails", appointmentDetails);

    return (<div className={classNames(overlay)}>
        <div data-testid="appointment-editor"
             className={classNames(appointmentEditor, editAppointment, appointmentDetails.appointmentType === RECURRING_APPOINTMENT_TYPE ? isRecurring : '')}>
            <CustomPopup triggerComponent={closeButton} popupContent={popupContent} style={customPopup}/>
            <AppointmentEditorCommonFieldsWrapper appointmentDetails={appointmentDetails} errors={errors}
                                                  updateErrorIndicators={updateErrorIndicators}
                                                  endTimeBasedOnService={endTimeBasedOnService}
                                                  updateAppointmentDetails={updateAppointmentDetails}
                                                  appConfig={appConfig}
                                                  setSelectedPriority={setSelectedPriority}
                                                  componentsDisableStatus={componentsDisableStatus}/>
            <div data-testid="recurring-plan-checkbox">
                <div className={classNames(appointmentPlanContainer)}>
                    <div className={classNames(appointmentPlanContainer)}>
                        <ContentSwitcher selectedIndex={isRecurringAppointment()? 1 : 0} >
                            <Switch name="Regular" disabled={isRecurringAppointment()}>Regular Appointment</Switch>
                            <Switch name="Recurring" disabled={!isRecurringAppointment()}>Recurring Appointment</Switch>
                        </ContentSwitcher>
                    </div>
                </div>
            </div>
            <div data-testid="appointment-type-checkbox" className={classNames(teleconsultation)}>
                {showAppointmentTypeControl()}
            </div>
            <div>
                <div>
                    <div data-testid="date-selector">
                        <DatePickerCarbon
                            onChange={date => {
                                if(date.length > 0) {
                                    updateAppointmentDetails({appointmentDate: date});
                                }
                                else {
                                    updateAppointmentDetails({appointmentDate: null});
                                }
                                console.log(date);
                                updateErrorIndicators({appointmentDateError: !date[0]});
                            }}
                            value={appointmentDetails.appointmentDate}
                            title={"Appointment date"}/>
                        <ErrorMessage message={errors.appointmentDateError ? errorTranslations.dateErrorMessage : undefined}/>
                    </div>
                    <div style={{display: "flex"}}>
                        <div style={{marginRight: "5px"}} data-testid="start-time-selector">
                            <TimeSelector {...appointmentStartTimeProps(appointmentDetails.startTime)}
                                          onChange={time => {
                                              updateAppointmentDetails({startTime: time});
                                              endTimeBasedOnService(time, appointmentDetails.service && appointmentDetails.service.value,
                                                  appointmentDetails.serviceType && appointmentDetails.serviceType.value);
                                              updateErrorIndicators({startTimeError: !time});
                                          }}
                                          isDisabled={componentsDisableStatus.time}/>
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
                                          }}
                                          isDisabled={componentsDisableStatus.time} />
                            {
                                errors.endTimeError ? <ErrorMessage message={errors.endTimeError ? errorTranslations.timeErrorMessage : undefined}/> : <ErrorMessage
                                    message={appointmentDetails.startTime && appointmentDetails.endTime && errors.startTimeBeforeEndTimeError ? errorTranslations.startTimeLessThanEndTimeMessage : undefined}/>
                            }
                        </div>
                    </div>
                    {isRecurringAppointment() ?
                        <div className={classNames(recurringDetailsEdit)}>
                            <div>
                                <div className={classNames(dateHeading)}>
                                    <Label translationKey="REPEATS_EVERY_LABEL" defaultValue="Repeats every"/>
                                </div>
                                <div>
                                    <span>{appointmentDetails.period} {isWeeklyRecurringAppointment()
                                        ? <Label translationKey="WEEK_LABEL" defaultValue="Week(s)"/>
                                        : <Label translationKey="DAY_LABEL" defaultValue="Day(s)"/>}</span>
                                </div>
                                <div className={classNames(weekDaySelector)}>
                                    {isWeeklyRecurringAppointment()
                                        ? <ButtonGroup buttonsList={appointmentDetails.weekDays} enable={false}/>
                                        : undefined}
                                </div>
                            </div>
                            <div className={classNames(recurringContainerBlock)}>
                                <div style={{minWidth: "100px"}}>
                                    <Dropdown id={"recurring-end"} options={[after, on]}
                                              onChange={event => {
                                                  endDateOnChange(event.selectedItem);
                                                  updateErrorIndicators({endDateTypeError: errors.endDateTypeError});
                                              }}
                                              selectedValue={appointmentDetails.endDateType || after}
                                    />
                                </div>
                                {appointmentDetails.endDateType === RECURRENCE_TERMINATION_AFTER
                                    ? (<div className={classNames(recurringContainerBlock)}>
                                        <div style={{width: "120px", marginRight: "5px"}} >
                                            <NumberInputCarbon
                                                onChange={value => {
                                                    updateAppointmentDetails({occurrences: value});
                                                    updateErrorIndicators({occurrencesError: !value || value < 1});
                                                }}
                                                value={appointmentDetails.occurrences}
                                                isDisabled={componentsDisableStatus.occurrences} />
                                        </div>
                                        <Label translationKey="OCCURRENCES_LABEL" defaultValue="Occurrences"/>
                                    </div>)
                                    : (<div className={classNames(recurringContainerBlock)}>
                                            <DatePickerCarbon
                                                onChange={date => {
                                                    if(date.length > 0) {
                                                        const selectedDate = moment(date[0]).toDate();
                                                        updateAppointmentDetails({recurringEndDate: selectedDate !== ' ' && !isNil(date)
                                                                ? moment(date[0]).endOf('day') : undefined})
                                                    }
                                                    else {
                                                        updateAppointmentDetails({recurringEndDate: null})
                                                        updateErrorIndicators({endDateError: true});
                                                    }
                                                    if (date)
                                                        updateErrorIndicators({endDateError: !date[0]});
                                                }}
                                                width={"160px"}
                                                value={appointmentDetails.recurringEndDate}
                                                isDisabled={componentsDisableStatus.endDate}
                                                minDate={moment(appointmentDetails.appointmentDate).format("MM-DD-YYYY")}
                                                testId={"recurring-end-date-selector"}/>
                                    </div>)}
                                <div className={classNames(recurringContainerBlock)}>
                                    <div className={classNames(firstBlock)}>&nbsp;</div>
                                    {
                                        appointmentDetails.endDateType === on ?
                                            <ErrorMessage message={errors.endDateError ? errorTranslations.dateErrorMessage : undefined}/> :
                                            <ErrorMessage message={errors.occurrencesError ? errorTranslations.occurrencesErrorMessage : undefined}/>
                                    }
                                </div>
                            </div>
                        </div> : undefined}
                </div>
            </div>
            <div data-testid={"appointment-notes"}>
                <AppointmentNotes value={appointmentDetails.notes} onChange={(event) => updateAppointmentDetails({notes: event.target.value})}/>
            </div>
            {showUpdateSuccessPopup ? React.cloneElement(updateSuccessPopup, {
                open: true,
                closeOnDocumentClick: false,
                closeOnEscape: false
            }) : undefined}

            {showUpdateConfirmPopup ? React.cloneElement(updateConfirmPopup, {
                open: true,
                closeOnDocumentClick: true,
                closeOnEscape: true
            }) : undefined}

        </div>
        <div  data-testid="Appointment-editer-footer">
            <AppointmentEditorFooter
                errorMessage={serviceErrorMessage}
                checkAndSave={applyForAllInd => updateAppointments(applyForAllInd)}
                isEdit={true}
                isOptionsRequired={isRecurringAppointment() && isApplicableForAll()}
                disableSaveAndUpdateButton={disableUpdateButton || (isStartDateModified() && (isEndDateModified() || isOccurrencesModified()))}
                cancelConfirmationMessage={CANCEL_CONFIRMATION_MESSAGE_EDIT}
            />
            {conflicts &&
                <CustomPopup style={conflictsPopup} open={true}
                             closeOnDocumentClick={false}
                             closeOnEscape={true}
                             onClose={() => setConflicts(undefined)}
                             popupContent={<Conflicts saveAnyway={saveAppointments}
                                                      modifyInformation={() => setConflicts(undefined)}
                                                      disableSaveAnywayButton={disableUpdateButton}
                                                      conflicts={conflicts} service={appointmentDetails.service}/>}/>}
        </div>
    </div>);
};

EditAppointment.propTypes = {
    intl: PropTypes.object.isRequired,
    appConfig: PropTypes.object,
    appointmentUuid: PropTypes.string.isRequired,
    isRecurring: PropTypes.string.isRequired,
    currentProvider: PropTypes.object,
    isAppointmentSMSEnabled: PropTypes.bool
};

export default injectIntl(EditAppointment);
