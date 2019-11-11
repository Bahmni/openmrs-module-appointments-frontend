import moment from "moment";

export const getAppointmentConflictDetails = conflict => {
    let appointmentConflictDetails = "";
    const appointmentStartDateTime = conflict.startDateTime;
    appointmentConflictDetails += moment(appointmentStartDateTime).format('Do');
    appointmentConflictDetails += ' ' + moment(appointmentStartDateTime).format('MMMM');
    appointmentConflictDetails += ' ‘' + moment(appointmentStartDateTime).format('YY');
    appointmentConflictDetails += ' | ' + moment(appointmentStartDateTime).format('dddd');
    appointmentConflictDetails += ' | ' + moment(appointmentStartDateTime).format('LT');

    return appointmentConflictDetails;
};
