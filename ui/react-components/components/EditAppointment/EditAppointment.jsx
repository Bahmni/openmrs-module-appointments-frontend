import PropTypes from "prop-types";
import {Fragment, useEffect, useState} from "react";
import React from "react";
import {injectIntl} from "react-intl";
import classNames from "classnames";
import {appointmentEditor} from "../AddAppointment/AddAppointment.module.scss";
import SearchFieldsContainer from "../SearchFieldsContainer/SearchFieldsContainer.jsx";

const EditAppointment = props => {

    const {appConfig} = props;

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

    const updateErrorIndicators = errorIndicators => setErrors(prevErrors => {return {...prevErrors, ...errorIndicators}});

    const updateAppointmentDetails = modifiedAppointmentDetails => setAppointmentDetails(prevAppointmentDetails => {
        return {...prevAppointmentDetails, ...modifiedAppointmentDetails}
    });

    useEffect(() => {
    }, [appConfig]);

    return (<Fragment>
        <div data-testid="appointment-editor" className={classNames(appointmentEditor)}>
            <SearchFieldsContainer appointmentDetails={appointmentDetails} errors={errors} updateErrorIndicators={updateErrorIndicators}
                                   updateAppointmentDetails={updateAppointmentDetails} appConfig={appConfig}/>
        </div>
    </Fragment>);
};

EditAppointment.propTypes = {
    intl: PropTypes.object.isRequired,
    appConfig: PropTypes.object,
    appointmentUuid: PropTypes.string.isRequired
};

export default injectIntl(EditAppointment);
