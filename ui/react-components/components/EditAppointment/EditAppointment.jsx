import PropTypes from "prop-types";
import {Fragment, useEffect, useState} from "react";
import React from "react";
import {injectIntl} from "react-intl";
import classNames from "classnames";
import {
    appointmentEditor,
    searchFieldsContainer,
    searchFieldsContainerLeft
} from "../AddAppointment/AddAppointment.module.scss";
import SearchFieldsContainer from "../SearchFieldsContainer/SearchFieldsContainer.jsx";
import {getRecurringAppointmentByUuid} from "../../api/recurringAppointmentsApi";
import {getAppointmentByUuid} from "../../api/appointmentsApi";
import {getPatientForDropdown} from "../../mapper/patientMapper";
import moment from "moment";
import {getDuration} from "../../helper";
import {MINUTES} from "../../constants";
import RecurringPlan from "../RecurringPlan/RecurringPlan.jsx";

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

    const generateAppointmentDetails = async () => {
        const appointment = isRecurring ? await getRecurringAppointmentByUuid(appointmentUuid) : await getAppointmentByUuid(appointmentUuid);
        const appointmentResponse = isRecurring
            ? (appointment && appointment.data && appointment.data.appointmentDefaultResponse) || undefined
            : (appointment && appointment.data && appointment.data) || undefined;
        if (appointmentResponse) {
            updateAppointmentDetails({
                patient: getPatientForDropdown(appointmentResponse.patient),
                providers: appointmentResponse.providers,
                service: {label: appointmentResponse.service.name, value: appointmentResponse.service},
                serviceType: appointmentResponse.serviceType ? {label: appointmentResponse.serviceType.name, value: appointmentResponse.serviceType} : undefined,
                location: appointmentResponse.location ? {label: appointmentResponse.location.name, value: appointmentResponse.location} : undefined,
                speciality: appointmentResponse.service.speciality.uuid ? {label: appointmentResponse.service.speciality.name, value: appointmentResponse.service.speciality} : undefined,
                startTime: appointmentResponse.startTime,
                endTime: appointmentResponse.endTime,
                notes: appointmentResponse.notes,
                isRecurring: isRecurring
            });
            if (isRecurring) {
                updateAppointmentDetails({
                    recurringStartDate: appointmentResponse.recurringStartDate,
                    recurringEndDate: appointmentResponse.recurringEndDate,
                    startDateType: appointmentResponse.startDateType,
                    endDateType: appointmentResponse.endDateType,
                    recurrenceType: appointmentResponse.recurrenceType,
                    occurrences: appointmentResponse.occurrences,
                    period: appointmentResponse.period,
                    weekDays: appointmentResponse.weekDays
                });
            } else {
                updateAppointmentDetails({
                    appointmentDate: appointmentResponse.appointmentDate,
                });
            }
        }
    };

    useEffect(() => {
        generateAppointmentDetails().then();
    }, [appConfig]);

    return (<Fragment>
        <div data-testid="appointment-editor" className={classNames(appointmentEditor)}>
            <SearchFieldsContainer appointmentDetails={appointmentDetails} errors={errors}
                                   updateErrorIndicators={updateErrorIndicators}
                                   endTimeBasedOnService={endTimeBasedOnService}
                                   updateAppointmentDetails={updateAppointmentDetails} appConfig={appConfig}/>
            <div className={classNames(searchFieldsContainer)} data-testid="recurring-plan-checkbox">
                <div className={classNames(searchFieldsContainerLeft)}>
                    <RecurringPlan isRecurring={appointmentDetails.isRecurring}/>
                </div>
            </div>
        </div>
    </Fragment>);
};

EditAppointment.propTypes = {
    intl: PropTypes.object.isRequired,
    appConfig: PropTypes.object,
    appointmentUuid: PropTypes.string.isRequired,
    isRecurring: PropTypes.bool.isRequired
};

export default injectIntl(EditAppointment);
