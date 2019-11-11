import PropTypes from "prop-types";
import React, {Fragment, useEffect, useState} from "react";
import {injectIntl} from "react-intl";
import classNames from "classnames";
import {
    appointmentEditor,
    recurringContainer,
    recurringContainerLeft,
    recurringContainerRight,
    searchFieldsContainer,
    searchFieldsContainerLeft,
    dateHeading
} from "../AddAppointment/AddAppointment.module.scss";
import SearchFieldsContainer from "../AppointmentEditorCommonFieldsWrapper/AppointmentEditorCommonFieldsWrapper.jsx";
import {getRecurringAppointment} from "../../api/recurringAppointmentsApi";
import {getAppointment} from "../../api/appointmentsApi";
import {getPatientForDropdown} from "../../mapper/patientMapper";
import moment from "moment";
import {getDuration, getYesterday} from "../../helper";
import {MINUTES} from "../../constants";
import RecurringPlan from "../RecurringPlan/RecurringPlan.jsx";
import Label from "../Label/Label.jsx";
import {
    currentTimeSlot,
    dateText,
    editAppointment,
    recurringDetailsEdit,
    recurringEndDateContainer
} from './EditAppointment.module.scss'
import TimeSelector from "../TimeSelector/TimeSelector.jsx";
import InputNumber from "../InputNumber/InputNumber.jsx";
import ButtonGroup from "../ButtonGroup/ButtonGroup.jsx";
import {getWeekDays, selectWeekDays} from "../../services/WeekDaysService/WeekDaysService";
import AppointmentNotes from "../AppointmentNotes/AppointmentNotes.jsx";
import AppointmentEditorFooter from "../AppointmentEditorFooter/AppointmentEditorFooter.jsx";
import {getProviderDropDownOptions} from "../../mapper/providerMapper";
import CalendarPicker from "../CalendarPicker/CalendarPicker.jsx";
import AppointmentDatePicker from "../DatePicker/DatePicker.jsx";
import {capitalize} from "lodash/string";

const EditAppointment = props => {

    const {appConfig, appointmentUuid, isRecurring} = props;

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
        isRecurring: isRecurring === 'true',
        notes: undefined,
        recurrenceType: undefined,
        occurrences: undefined,
        period: undefined,
        weekDays: undefined
    };
    const [appointmentDetails, setAppointmentDetails] = useState(initialAppointmentState);

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

    const [currentStartTime, setCurrentStartTime] = useState();
    const [currentEndTime, setCurrentEndTime] = useState();

    const generateAppointmentDetails = async () => {
        const appointment = appointmentDetails.isRecurring ? await getRecurringAppointment(appointmentUuid) : await getAppointment(appointmentUuid);
        const appointmentResponse = appointmentDetails.isRecurring
            ? (appointment && appointment.data && appointment.data.appointmentDefaultResponse) || undefined
            : (appointment && appointment.data && appointment.data) || undefined;
        const recurringPattern = appointmentDetails.isRecurring
            ? (appointment && appointment.data && appointment.data.recurringPattern) || undefined : undefined;
        if (appointmentResponse) {
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
            });
            setCurrentStartTime(moment(new Date(appointmentResponse.startDateTime)).format('hh:mm a'));
            setCurrentEndTime(moment(new Date(appointmentResponse.endDateTime)).format('hh:mm a'));
            if (appointmentDetails.isRecurring) {
                updateAppointmentDetails({
                    recurrenceType: recurringPattern.type,
                    recurringStartDate: moment(new Date(appointmentResponse.startDateTime)),
                    recurringEndDate: recurringPattern.endDate && moment(new Date(recurringPattern.endDate)),
                    occurrences: recurringPattern.frequency,
                    period: recurringPattern.period,
                    weekDays: recurringPattern.daysOfWeek && selectWeekDays(getWeekDays(appConfig && appConfig.startOfWeek), recurringPattern.daysOfWeek)
                });
            }
        }
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

    useEffect(() => {
        generateAppointmentDetails().then();
    }, [appConfig]);

    return (<Fragment>
        <div data-testid="appointment-editor" className={classNames(appointmentEditor, editAppointment)}>
            <SearchFieldsContainer appointmentDetails={appointmentDetails} errors={errors}
                                   updateErrorIndicators={updateErrorIndicators}
                                   endTimeBasedOnService={endTimeBasedOnService}
                                   updateAppointmentDetails={updateAppointmentDetails} appConfig={appConfig}/>
            <div className={classNames(searchFieldsContainer)} data-testid="recurring-plan-checkbox">
                <div className={classNames(searchFieldsContainerLeft)}>
                    <RecurringPlan isRecurring={appointmentDetails.isRecurring} isEdit={true}/>
                </div>
            </div>
            <div className={classNames(recurringContainer)}>
                <div className={classNames(recurringContainerLeft)}>
                    <div data-testid="date-selector">
                        <div className={classNames(dateHeading)}><Label translationKey='CHANGE_DATE_TO_LABEL'
                                                                        defaultValue='Change date to'/></div>
                        <AppointmentDatePicker
                            onChange={date => {
                                updateAppointmentDetails({appointmentDate: date});
                                updateErrorIndicators({appointmentDateError: !date});
                            }}
                            onClear={() => updateAppointmentDetails({appointmentDate: undefined})}
                            defaultValue={appointmentDetails.appointmentDate}
                            minDate={getYesterday()}/>
                    </div>
                    <div>
                        <div className={classNames(dateHeading)} ><Label translationKey="CURRENT_TIME_SLOT_LABEL" defaultValue="Current time slot"/></div>
                        <div className={classNames(currentTimeSlot)}>
                            <span>{currentStartTime}</span>
                            <span> to </span>
                            <span>{currentEndTime}</span>
                        </div>
                        <div className={classNames(dateHeading)} ><Label translationKey="APPOINTMENT_TIME_LABEL" defaultValue="Choose a time slot"/></div>
                        <div data-testid="start-time-selector">
                            <TimeSelector {...appointmentStartTimeProps}
                                          onChange={time => {
                                              updateAppointmentDetails({startTime: time});
                                              endTimeBasedOnService(time, appointmentDetails.service, appointmentDetails.serviceType);
                                          }}/>
                        </div>
                        <div data-testid="end-time-selector">
                            <TimeSelector {...appointmentEndTimeProps}
                                          onChange={time => {
                                              updateAppointmentDetails({endTime: time});
                                          }}/>
                        </div>
                    </div>
                    {appointmentDetails.isRecurring ?
                        <div className={classNames(recurringDetailsEdit)}>
                            <div>
                                <div className={classNames(dateHeading)}><Label translationKey="REPEATS_EVERY_LABEL" defaultValue="Repeats every"/></div>
                                <div>
                                    <span>{moment.localeData().ordinal(appointmentDetails.period)} &nbsp; {appointmentDetails.recurrenceType === 'WEEK'
                                        ? <Label translationKey="WEEK_LABEL" defaultValue="Week"/>
                                        : <Label translationKey="DAY_LABEL" defaultValue="Day"/>}</span>
                                </div>
                                <div>
                                    {appointmentDetails.recurrenceType === 'WEEK'
                                        ? <ButtonGroup buttonsList={appointmentDetails.weekDays}/>
                                        : undefined}
                                </div>
                            </div>
                            {appointmentDetails.occurrences
                                ? (<div>
                                    <div className={classNames(dateHeading)}>
                                        <Label translationKey="NUMBER_OF_OCCURRENCE_LABEL"
                                               defaultValue="# of occurrences"/>
                                    </div>
                                    <InputNumber
                                        onOccurrencesChange={value => updateAppointmentDetails({occurrences: value})}
                                        defaultValue={appointmentDetails.occurrences}/>
                                    <Label translationKey="OCCURRENCES_LABEL" defaultValue="Occurrences"/>
                                </div>)
                                : (<div className={classNames(recurringEndDateContainer)}>
                                    <div className={classNames(dateHeading)}>
                                        <Label translationKey="NEW_END_DATE_LABEL" defaultValue="New end date"/>
                                    </div>
                                    <div>
                                        <span>{moment(appointmentDetails.recurringEndDate).format("Do MMMM YYYY")}</span>
                                        <span className={classNames(dateText)}>
                                            {capitalize(moment(appointmentDetails.recurringEndDate).format("dddd"))}
                                        </span>
                                        <span><CalendarPicker date={appointmentDetails.recurringEndDate}/></span>
                                    </div>
                                </div>)}
                        </div> : undefined}
                </div>
                <div className={classNames(recurringContainerRight)}>
                    <div className={classNames(dateHeading)}><Label translationKey="APPOINTMENT_NOTES"
                                                                    defaultValue="Notes"/></div>
                    <AppointmentNotes value={appointmentDetails.notes} onChange={(event) => updateAppointmentDetails({notes: event.target.value})}/>
                </div>
            </div>
            <AppointmentEditorFooter isEdit={true}/>
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
