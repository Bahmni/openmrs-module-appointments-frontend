export const getDateTime = (appointmentDate, appointmentTime) => {
    if (!appointmentDate && !appointmentTime) return appointmentDate;
    var formattedTime = moment(appointmentTime, ["hh:mm a"]).format("HH:mm");
    return parseDateToUTC(getDateWithoutTime(appointmentDate) + ' ' + formattedTime);
};

export const isStartTimeBeforeEndTime = (startDateTime, endDateTime) => {
    return startDateTime && endDateTime && moment(startDateTime).isBefore(moment(endDateTime));
};

const getDateWithoutTime = (datetime) => {
    return datetime ? moment(datetime).format("YYYY-MM-DD") : null;
};

const parseDateToUTC = (longDate) => {
    return longDate ? moment(longDate, "YYYY-MM-DDTHH:mm:ss.SSSZZ").toDate() : null;
};
