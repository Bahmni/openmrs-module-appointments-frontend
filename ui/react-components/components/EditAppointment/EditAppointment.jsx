import PropTypes from "prop-types";
import React, {Fragment, useEffect, useState} from "react";
import {injectIntl} from "react-intl";
import classNames from "classnames";
import {
    appointmentEditor,
    appointmentPlanContainer,
    dateHeading,
    recurringContainer,
    recurringContainerLeft,
    recurringContainerRight,
    searchFieldsContainer
} from "../AddAppointment/AddAppointment.module.scss";
import {conflictsPopup, customPopup} from "../CustomPopup/CustomPopup.module.scss";
import AppointmentEditorCommonFieldsWrapper
    from "../AppointmentEditorCommonFieldsWrapper/AppointmentEditorCommonFieldsWrapper.jsx";
import {getRecurringAppointment} from "../../api/recurringAppointmentsApi";
import {getAppointment} from "../../api/appointmentsApi";
import {getPatientForDropdown} from "../../mapper/patientMapper";
import moment from "moment";
import 'moment-timezone';
import {getDuration, getYesterday} from "../../helper";
import {
    CANCEL_CONFIRMATION_MESSAGE_EDIT,
    MINUTES, RECURRENCE_TERMINATION_AFTER, RECURRENCE_TERMINATION_ON,
    RECURRING_APPOINTMENT_TYPE,
    SCHEDULED_APPOINTMENT_TYPE,
    WALK_IN_APPOINTMENT_TYPE, weekRecurrenceType
} from "../../constants";
import AppointmentPlan from "../AppointmentPlan/AppointmentPlan.jsx";
import Label from "../Label/Label.jsx";
import {
    currentTimeSlot,
    dateText,
    editAppointment,
    recurringDetailsEdit,
    recurringEndDateContainer,
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
import UpdateSuccessModal from "../SuccessModal/UpdateSuccessModal.jsx";
import UpdateConfirmationModal from "../UpdateConfirmationModal/UpdateConfirmationModal.jsx";
import {getComponentsDisableStatus} from "./ComponentsDisableStatus";
import {isEqual} from "lodash";
import ErrorMessage from "../ErrorMessage/ErrorMessage.jsx";
import {getErrorTranslations} from "../../utils/ErrorTranslationsUtil";
import {AppContext} from "../AppContext/AppContext";


const EditAppointment = props => {

    const {appConfig, appointmentUuid, isRecurring, intl} = props;

    const {setViewDate} = React.useContext(AppContext);

    const [errors, setErrors] = useState({
        serviceError: false,
        appointmentDateError: false,
        endDateError: false,
        occurrencesError: false,
        startTimeError: false,
        endTimeError: false,
        recurrencePeriodError: false,
        startTimeBeforeEndTimeError: false,
        weekDaysError: false
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
        endDateType: undefined
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

    const isRecurringAppointment = () => appointmentDetails.appointmentType === RECURRING_APPOINTMENT_TYPE;
    const isWalkInAppointment = () => appointmentDetails.appointmentType === WALK_IN_APPOINTMENT_TYPE;
    const [componentsDisableStatus, setComponentsDisableStatus] = useState({});

    const errorTranslations = getErrorTranslations(intl);

    const updateErrorIndicators = errorIndicators => setErrors(prevErrors => {
        return {...prevErrors, ...errorIndicators}
    });

    const updateAppointmentDetails = modifiedAppointmentDetails => setAppointmentDetails(prevAppointmentDetails => {
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

    const getAppointmentRequest = () => {
        let appointment = {
            uuid: appointmentUuid,
            patientUuid: appointmentDetails.patient && appointmentDetails.patient.value.uuid,
            serviceUuid: appointmentDetails.service && appointmentDetails.service.value.uuid,
            serviceTypeUuid: appointmentDetails.serviceType && appointmentDetails.serviceType.value &&
                appointmentDetails.serviceType.value.uuid,
            startDateTime: getDateTime(appointmentDetails.appointmentDate, appointmentDetails.startTime),
            endDateTime: getDateTime(appointmentDetails.appointmentDate, appointmentDetails.endTime),
            providers: appointmentDetails.providers,
            locationUuid: appointmentDetails.location && appointmentDetails.location.value && appointmentDetails.location.value.uuid,
            appointmentKind: appointmentDetails.appointmentKind,
            comments: appointmentDetails.notes
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

    const checkAndSave = async () => {
        if (isValidAppointment()) {
            const appointment = getAppointmentRequest();
            const response = await getAppointmentConflicts(appointment);
            if (response.status === 204) {
                setShowUpdateConfirmPopup(true);
            }
            response.status === 200 && setConflicts(response.data);
        }
    };

    const showSuccessPopUp = startDate => {
        setViewDate(startDate.startOf('day').toDate());
        setShowUpdateSuccessPopup(true);
    }

    const save = async appointmentRequest => {
        const response = await saveAppointment(appointmentRequest);
        if (response.status === 200) {
            setConflicts(undefined);
            setShowUpdateConfirmPopup(false);
            showSuccessPopUp(appointmentDetails.appointmentDate);
        }
    };

    const updateAllAppointments = async recurringAppointmentRequest => {
        const response = await updateRecurring(recurringAppointmentRequest);
        if (response.status === 200) {
            setConflicts(undefined);
            setShowUpdateConfirmPopup(false);
            showSuccessPopUp(appointmentDetails.appointmentDate);

        }
    };

    const checkAndUpdateRecurringAppointments = async (applyForAllInd) => {
        if (isValidRecurringAppointment()) {
            const recurringRequest = getRecurringAppointmentRequest(applyForAllInd);
            const response = await getRecurringAppointmentsConflicts(recurringRequest);
            if (response.status === 204) {
                setShowUpdateConfirmPopup(true);
            }
            response.status === 200 && setConflicts(response.data);
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

    const generateAppointmentDetails = async (callback) => {
        const appointment = isRecurringAppointment()
            ? await getRecurringAppointment(appointmentUuid) : await getAppointment(appointmentUuid);
        const appointmentResponse = isRecurringAppointment()
            ? (appointment && appointment.data && appointment.data.appointmentDefaultResponse) || undefined
            : (appointment && appointment.data) || undefined;
        const recurringPattern = isRecurringAppointment()
            ? (appointment && appointment.data && appointment.data.recurringPattern) || undefined : undefined;
        if (appointmentResponse) {
            setOriginalAppointmentDate(moment(new Date(appointmentResponse.startDateTime)));
            updateAppointmentDetails({
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
                    appointmentResponse.appointmentKind === WALK_IN_APPOINTMENT_TYPE ? WALK_IN_APPOINTMENT_TYPE : undefined
            });
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

    const isStartDateModified = () => isDateModified(originalAppointmentDate, appointmentDetails.appointmentDate);

    const isEndDateModified = () => isDateModified(originalRecurringEndDate, appointmentDetails.recurringEndDate);

    const isDateModified = (originalDate, modifiedDate) => !isEqual(moment(originalDate).format('DMYYYY'), moment(modifiedDate).format('DMYYYY'));

    const isOccurrencesModified = () => originalOccurrences !== appointmentDetails.occurrences;

    const isApplicableForAll = () => !(isStartDateModified() || isEndDateModified() || isOccurrencesModified());

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

    useEffect(() => {
        const setDisableStatus = (appointmentResponse) => setComponentsDisableStatus(getComponentsDisableStatus(appointmentResponse,
            appConfig && appConfig.isServiceOnAppointmentEditable));
        generateAppointmentDetails(setDisableStatus).then();
    }, [appConfig]);

    return (<Fragment>
        <div data-testid="appointment-editor" className={classNames(appointmentEditor, editAppointment)}>
            <AppointmentEditorCommonFieldsWrapper appointmentDetails={appointmentDetails} errors={errors}
                                                  updateErrorIndicators={updateErrorIndicators}
                                                  endTimeBasedOnService={endTimeBasedOnService}
                                                  updateAppointmentDetails={updateAppointmentDetails}
                                                  appConfig={appConfig}
                                                  componentsDisableStatus={componentsDisableStatus} />
            <div className={classNames(searchFieldsContainer)} data-testid="recurring-plan-checkbox">
                <div className={classNames(appointmentPlanContainer)}>
                    <AppointmentPlan isEdit={true} appointmentType={appointmentDetails.appointmentType}
                                     onChange={(e) => e.target.name === WALK_IN_APPOINTMENT_TYPE ?
                                         updateAppointmentDetails({
                                             appointmentType: isWalkInAppointment()
                                                 ? undefined : WALK_IN_APPOINTMENT_TYPE,
                                             appointmentKind: isWalkInAppointment()
                                             ? SCHEDULED_APPOINTMENT_TYPE : WALK_IN_APPOINTMENT_TYPE
                                         }) : undefined
                                     }
                                    isRecurringDisabled={componentsDisableStatus.recurring}
                                    isWalkInDisabled={componentsDisableStatus.walkIn}/>
                </div>
            </div>
            <div className={classNames(recurringContainer)}>
                <div className={classNames(recurringContainerLeft)}>
                    <div data-testid="date-selector">
                        <div className={classNames(dateHeading)}><Label translationKey='CHANGE_DATE_TO_LABEL'
                                                                        defaultValue={`Change ${moment(originalAppointmentDate).format('Do MMM')} to`}/></div>
                        <AppointmentDatePicker
                            onChange={date => {
                                updateAppointmentDetails({appointmentDate: date});
                                updateErrorIndicators({appointmentDateError: !date});
                            }}
                            onClear={() => updateAppointmentDetails({appointmentDate: undefined})}
                            defaultValue={appointmentDetails.appointmentDate}
                            minDate={getYesterday()}
                            isDisabled={componentsDisableStatus.startDate}/>
                        <ErrorMessage message={errors.appointmentDateError ? errorTranslations.dateErrorMessage : undefined}/>
                    </div>
                    <div>
                        <div className={classNames(dateHeading)}>
                            <Label translationKey="CURRENT_TIME_SLOT_LABEL" defaultValue="Current time slot"/>
                        </div>
                        <div className={classNames(currentTimeSlot)}>
                            <span>{currentStartTime}</span>
                            <span> to </span>
                            <span>{currentEndTime}</span>
                        </div>
                        <div className={classNames(dateHeading)}>
                            <Label translationKey="APPOINTMENT_TIME_LABEL" defaultValue="Choose a time slot"/>
                        </div>
                        <div data-testid="start-time-selector">
                            <TimeSelector {...appointmentStartTimeProps}
                                          onChange={time => {
                                              updateAppointmentDetails({startTime: time});
                                              endTimeBasedOnService(time, appointmentDetails.service, appointmentDetails.serviceType);
                                              updateErrorIndicators({startTimeError: !time});
                                          }}
                                          isDisabled={componentsDisableStatus.time} />
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
                                          }}
                                          isDisabled={componentsDisableStatus.time} />
                            <ErrorMessage message={errors.endTimeError ? errorTranslations.timeErrorMessage : undefined}/>
                        </div>
                        <ErrorMessage
                            message={appointmentDetails.startTime && appointmentDetails.endTime && errors.startTimeBeforeEndTimeError ? errorTranslations.startTimeLessThanEndTimeMessage : undefined}/>
                    </div>
                    {isRecurringAppointment() ?
                        <div className={classNames(recurringDetailsEdit)}>
                            <div>
                                <div className={classNames(dateHeading)}>
                                    <Label translationKey="REPEATS_EVERY_LABEL" defaultValue="Repeats every"/>
                                </div>
                                <div class={classNames(recurringTerminationDetails)}>
                                    <span>{moment.localeData().ordinal(appointmentDetails.period)} &nbsp; {isWeeklyRecurringAppointment()
                                        ? <Label translationKey="WEEK_LABEL" defaultValue="Week"/>
                                        : <Label translationKey="DAY_LABEL" defaultValue="Day"/>}</span>
                                </div>
                                <div className={classNames(weekDaySelector)}>
                                    {isWeeklyRecurringAppointment()
                                        ? <ButtonGroup buttonsList={appointmentDetails.weekDays}/>
                                        : undefined}
                                </div>
                            </div>
                            {appointmentDetails.endDateType === RECURRENCE_TERMINATION_AFTER
                                ? (<div>
                                    <div className={classNames(dateHeading)}>
                                        <Label translationKey="NUMBER_OF_OCCURRENCE_LABEL"
                                               defaultValue="# of occurrences"/>
                                    </div>
                                    <InputNumber
                                        onChange={value => {
                                            updateAppointmentDetails({occurrences: value});
                                            updateErrorIndicators({occurrencesError: !value || value < 1});
                                        }}
                                        defaultValue={appointmentDetails.occurrences}
                                        isDisabled={componentsDisableStatus.occurrences} />
                                    <Label translationKey="OCCURRENCES_LABEL" defaultValue="Occurrences"/>
                                    <ErrorMessage message={errors.occurrencesError ? errorTranslations.occurrencesErrorMessage : undefined}/>

                                </div>)
                                : (<div className={classNames(recurringEndDateContainer)}>
                                    <div className={classNames(dateHeading)}>
                                        <Label translationKey="NEW_END_DATE_LABEL" defaultValue="Series ends on"/>
                                    </div>
                                    <div class={classNames(recurringTerminationDetails)}>
                                        <span>{moment(appointmentDetails.recurringEndDate).format("Do MMMM YYYY")}</span>
                                        <span className={classNames(dateText)}>
                                            {capitalize(moment(appointmentDetails.recurringEndDate).format("dddd"))}
                                        </span>
                                        <span>
                                            <CalendarPicker
                                                onChange={date => {
                                                    updateAppointmentDetails({recurringEndDate: date})
                                                    if (date)
                                                        updateErrorIndicators({endDateError: !date});
                                                }}
                                                date={appointmentDetails.recurringEndDate}
                                                isDisabled={componentsDisableStatus.endDate}
                                                startDate={appointmentDetails.appointmentDate}/>
                                        </span>
                                    </div>
                                    <ErrorMessage message={errors.endDateError ? errorTranslations.dateErrorMessage : undefined}/>
                                </div>)}
                        </div> : undefined}
                </div>
                <div className={classNames(recurringContainerRight)}>
                    <div className={classNames(dateHeading)}><Label translationKey="APPOINTMENT_NOTES"
                                                                    defaultValue="Notes"/></div>
                    <AppointmentNotes value={appointmentDetails.notes} onChange={(event) => updateAppointmentDetails({notes: event.target.value})}/>
                </div>
            </div>
            <AppointmentEditorFooter
                checkAndSave={applyForAllInd => updateAppointments(applyForAllInd)}
                isEdit={true}
                isOptionsRequired={isRecurringAppointment() && isApplicableForAll()}
                disableUpdateButton={isStartDateModified() && (isEndDateModified() || isOccurrencesModified())}
                cancelConfirmationMessage={CANCEL_CONFIRMATION_MESSAGE_EDIT}
            />
            {conflicts &&
            <CustomPopup style={conflictsPopup} open={true}
                         closeOnDocumentClick={false}
                         closeOnEscape={true}
                         onClose={() => setConflicts(undefined)}
                         popupContent={<Conflicts saveAnyway={saveAppointments}
                                                  modifyInformation={() => setConflicts(undefined)}
                                                  conflicts={conflicts} service={appointmentDetails.service}/>}/>}
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
    </Fragment>);
};

EditAppointment.propTypes = {
    intl: PropTypes.object.isRequired,
    appConfig: PropTypes.object,
    appointmentUuid: PropTypes.string.isRequired,
    isRecurring: PropTypes.string.isRequired
};

export default injectIntl(EditAppointment);
