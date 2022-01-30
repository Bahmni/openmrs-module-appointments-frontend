export const getErrorTranslations = intl => {
    return {
        patientErrorMessage: intl.formatMessage({
            id: 'PATIENT_ERROR_MESSAGE', defaultMessage: 'Please select patient'
        }),
        serviceErrorMessage: intl.formatMessage({
            id: 'SERVICE_ERROR_MESSAGE', defaultMessage: 'Please select service'
        }),
        dateErrorMessage: intl.formatMessage({
            id: 'DATE_ERROR_MESSAGE', defaultMessage: 'Please select date'
        }),
        occurrencesErrorMessage: intl.formatMessage({
            id: 'OCCURRENCE_ERROR_MESSAGE', defaultMessage: 'Please select valid occurrences'
        }),
        endDateTypeErrorMessage: intl.formatMessage({
            id: 'ENDDATE_TYPE_ERROR_MESSAGE', defaultMessage: 'Please select recurrence end type'
        }),
        timeErrorMessage: intl.formatMessage({
            id: 'TIME_ERROR_MESSAGE', defaultMessage: 'Please select time'
        }),
        recurrencePeriodErrorMessage: intl.formatMessage({
            id: 'RECURRENCE_PERIOD_ERROR_MESSAGE', defaultMessage: 'Please select valid recurrence period'
        }),
        startTimeLessThanEndTimeMessage: intl.formatMessage({
            id: 'START_TIME_LESSTHAN_END_TME_ERROR_MESSAGE', defaultMessage: 'From time should be before to time'
        }),
        weekDaysErrorMessage: intl.formatMessage({
            id: 'RECURRENCE_WEEKDAYS_ERROR_MESSAGE', defaultMessage: 'Please select the day(s)'
        }),
        noContentErrorMessage: intl.formatMessage({
            id: 'NO_CONTENT_ERROR_MESSAGE', defaultMessage: 'Selected days do not fall under the end date selected'
        }),
        unexpectedServiceErrorMessage: intl.formatMessage({
            id: 'UNEXPECTED_SERVICE_ERROR', defaultMessage: 'There was an unexpected issue on the server. Please try again'
        }),
        locationErrorMessage: intl.formatMessage({
            id: 'LOCATION_ERROR_MESSAGE', defaultMessage: 'Please select a location'
        }),
        serviceTypeErrorMessage: intl.formatMessage({
            id: 'SERVICE_APP_TYPE_ERROR_MESSAGE', defaultMessage: 'Please select a service App Type'
        }),
    };
};

export const getMaxAppointmentProvidersErrorMessage = (intl, maxAppointmentProviders) => {
    return {
        providerErrorMessage: intl.formatMessage({
            id: 'PROVIDER_ERROR_MESSAGE',
            defaultMessage: 'Please select only a maximum of {maxAppointmentProviders} provider(s)',
        }, {maxAppointmentProviders: maxAppointmentProviders})
    }
};
