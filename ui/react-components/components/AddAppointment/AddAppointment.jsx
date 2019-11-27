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
    weekDaysContainer,
    appointmentPlanContainer
} from './AddAppointment.module.scss';
import {conflictsPopup, customPopup} from "../CustomPopup/CustomPopup.module.scss";
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
import AppointmentPlan from "../AppointmentPlan/AppointmentPlan.jsx";
import CustomPopup from "../CustomPopup/CustomPopup.jsx";
import SuccessConfirmation from "../SuccessModal/SuccessModal.jsx";
import {AppContext} from "../AppContext/AppContext";
import AppointmentDatePicker from "../DatePicker/DatePicker.jsx";
import StartDateRadioGroup from "../RadioGroup/StartDateRadioGroup.jsx";
import EndDateRadioGroup from "../RadioGroup/EndDateRadioGroup.jsx";
import RecurrenceTypeRadioGroup from "../RadioGroup/RecurrenceTypeRadioGroup.jsx";
import {
    CANCEL_CONFIRMATION_MESSAGE_ADD,
    dayRecurrenceType,
    FROM,
    MINUTES,
    RECURRING_APPOINTMENT_TYPE,
    TODAY,
    WALK_IN_APPOINTMENT_TYPE
} from "../../constants";
import moment from "moment";
import {
    getDefaultOccurrences,
    getDuration,
    getYesterday
} from "../../helper.js";
import {getSelectedWeekDays, getWeekDays} from "../../services/WeekDaysService/WeekDaysService";
import ButtonGroup from "../ButtonGroup/ButtonGroup.jsx";
import {getErrorTranslations} from "../../utils/ErrorTranslationsUtil";
import {isEmpty} from 'lodash';
import SearchFieldsContainer from "../AppointmentEditorCommonFieldsWrapper/AppointmentEditorCommonFieldsWrapper.jsx";
import Conflicts from "../Conflicts/Conflicts.jsx";

const AddAppointment = props => {

    const {appConfig, intl} = props;
    const {setViewDate} = React.useContext(AppContext);
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
        appointmentType: undefined,
        notes: undefined,
        startDateType: undefined,
        endDateType: undefined,
        recurrenceType: dayRecurrenceType,
        occurrences: undefined,
        period: undefined,
        weekDays: undefined,
    };

    const [appointmentDetails, setAppointmentDetails] = useState(initialAppointmentState);
    const [conflicts, setConflicts] = useState();
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

    const isRecurringAppointment = () => appointmentDetails.appointmentType === RECURRING_APPOINTMENT_TYPE;
    const isWalkInAppointment = () => appointmentDetails.appointmentType === WALK_IN_APPOINTMENT_TYPE;

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
            appointmentKind: isWalkInAppointment() ? WALK_IN_APPOINTMENT_TYPE : "Scheduled",
            comments: appointmentDetails.notes
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

    const isValidAppointment = () => {
        const isValidPatient = appointmentDetails.patient && appointmentDetails.patient.value.uuid;
        const startTimeBeforeEndTime = isStartTimeBeforeEndTime(appointmentDetails.startTime, appointmentDetails.endTime);
        updateCommonErrorIndicators(isValidPatient, startTimeBeforeEndTime);
        updateErrorIndicators({appointmentDateError: !appointmentDetails.appointmentDate});
        return isValidPatient && appointmentDetails.service && appointmentDetails.appointmentDate && appointmentDetails.startTime && appointmentDetails.endTime && startTimeBeforeEndTime;
    };

    const isValidRecurringAppointment = () => {
        const isValidPatient = appointmentDetails.patient && appointmentDetails.patient.value.uuid;
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

    const showSuccessPopUp = startDate => {
        setViewDate(startDate.startOf('day').toDate());
        setShowSuccessPopup(true);
    };

    const save = async appointmentRequest => {
        const response = await saveAppointment(appointmentRequest);
        if (response.status === 200) {
            setConflicts(undefined);
            showSuccessPopUp(appointmentDetails.appointmentDate);
        }
    };

    const checkAndSave = async () => {
        if (isValidAppointment()) {
            const appointment = getAppointmentRequest();
            const response = await getAppointmentConflicts(appointment);
            if (response.status === 204) {
                await save(appointment);
            }
            response.status === 200 && setConflicts(response.data);
        }
    };

    const saveRecurringAppointments = async recurringAppointmentRequest => {
        const response = await saveRecurring(recurringAppointmentRequest);
        if (response.status === 200) {
            setConflicts(undefined);
            showSuccessPopUp(appointmentDetails.recurringStartDate);
        }
    };

    const checkAndSaveRecurringAppointments = async () => {
        if (isValidRecurringAppointment()) {
            const recurringRequest = getRecurringAppointmentRequest();
            const response = await getRecurringAppointmentsConflicts(recurringRequest);
            if (response.status === 204) {
                await saveRecurringAppointments(recurringRequest);
            }
            response.status === 200 && setConflicts(response.data);
        }
    };

    const saveAppointments = () => {
        isRecurringAppointment()
            ? saveRecurringAppointments(getRecurringAppointmentRequest()) : save(getAppointmentRequest());
    };

    const savePopup = <CustomPopup style={customPopup}
        popupContent={<SuccessConfirmation patientDetails={appointmentDetails.patient && `${appointmentDetails.patient.value.name} (${appointmentDetails.patient.value.identifier})`}/>}/>;

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
            <SearchFieldsContainer updateAppointmentDetails={updateAppointmentDetails} updateErrorIndicators={updateErrorIndicators}
                                   appointmentDetails={appointmentDetails} endTimeBasedOnService={endTimeBasedOnService} appConfig={appConfig} errors={errors}/>
            <div className={classNames(searchFieldsContainer)} data-testid="recurring-plan-checkbox">
                <div className={classNames(appointmentPlanContainer)}>
                    <AppointmentPlan appointmentType={appointmentDetails.appointmentType}
                                     onChange={(e) => {
                                         if (appointmentDetails.appointmentType === e.target.name)
                                             updateAppointmentDetails({appointmentType: undefined});
                                         else
                                             updateAppointmentDetails({appointmentType: e.target.name})
                                     }}/>
                </div>
            </div>
            <div className={classNames(recurringContainer)}>
                {isRecurringAppointment() ?
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
                            <div className={classNames(dateHeading)}>
                                <Label translationKey="APPOINTMENT_DATE_LABEL" defaultValue="Appointment date"/>
                            </div>
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
                            <div className={classNames(dateHeading)}><Label translationKey="APPOINTMENT_TIME_LABEL" defaultValue="Choose a time slot"/></div>
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
                    <div className={classNames(dateHeading)}><Label translationKey="APPOINTMENT_NOTES" defaultValue="Notes"/></div>
                    <AppointmentNotes value={appointmentDetails.notes} onChange={(event) => updateAppointmentDetails({notes: event.target.value})}/>
                </div>
            </div>
            <AppointmentEditorFooter
              checkAndSave={isRecurringAppointment() ? checkAndSaveRecurringAppointments : checkAndSave}
              cancelConfirmationMessage={CANCEL_CONFIRMATION_MESSAGE_ADD}/>
            {conflicts &&
                <CustomPopup style={conflictsPopup} open={true}
                             closeOnDocumentClick={false}
                             closeOnEscape={true}
                             onClose={() => setConflicts(undefined)}
                             popupContent={<Conflicts saveAnyway={saveAppointments}
                                                      modifyInformation={() => setConflicts(undefined)}
                                                      conflicts={conflicts} service={appointmentDetails.service}
                                                      isRecurring={appointmentDetails.isRecurring}/>}/>}
            {showSuccessPopup ? React.cloneElement(savePopup, {
                open: true,
                closeOnDocumentClick: false,
                closeOnEscape: false
            }) : undefined}
        </div>
    </Fragment>);
};

AddAppointment.propTypes = {
    intl: PropTypes.object.isRequired,
    appConfig: PropTypes.object,
};

export default injectIntl(AddAppointment);
