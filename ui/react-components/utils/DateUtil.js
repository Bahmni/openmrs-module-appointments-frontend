import moment from "moment";
import _ from 'lodash'
import {getLocale} from "./LocalStorageUtil";

export const getDateTime = (appointmentDate, appointmentTime) => {
    if (!appointmentDate && !appointmentTime) return appointmentDate;
    const formattedTime = moment(appointmentTime, ["hh:mm a"]).format("HH:mm");
    return parseDateToUTC(getDateWithoutTime(appointmentDate) + ' ' + formattedTime);
};

export const isStartTimeBeforeEndTime = (startDateTime, endDateTime) => {
    return (!startDateTime || !endDateTime) || moment(startDateTime).isBefore(moment(endDateTime));
};

// The time picker builds its value from the typed time only, so it carries today's date.
// Put the selected appointment date on it so start and end times share the same date.
export const applyDateToTime = (date, time) => {
    if (!date || !time || !moment(time).isValid()) return time;
    const selectedDate = moment(date);
    return moment(time).set({
        year: selectedDate.year(),
        month: selectedDate.month(),
        date: selectedDate.date()
    });
};

// Re-dates both start and end time onto the given date and recomputes whether the
// start time is still before the end time, so callers can update state in one place.
export const applyDateToTimes = (date, startTime, endTime) => {
    const newStartTime = applyDateToTime(date, startTime);
    const newEndTime = applyDateToTime(date, endTime);
    return {
        startTime: newStartTime,
        endTime: newEndTime,
        startTimeBeforeEndTimeError: !isStartTimeBeforeEndTime(newStartTime, newEndTime)
    };
};

export const isValidDate= (dateValue) =>{
    let selectedDate = dateValue;

    if (_.isNil(selectedDate) || selectedDate === '') {
        return false;
    }

    selectedDate = moment(selectedDate, "DD/MMM/YYYY", true);
    return selectedDate.isValid();
    
}

const getDateWithoutTime = (datetime) => {
    return datetime ? moment(datetime).format("YYYY-MM-DD") : null;
};

const parseDateToUTC = (longDate) => {
    return longDate ? moment(longDate, "YYYY-MM-DDTHH:mm:ss.SSSZZ").toDate() : null;
};

export const getUserLocale = () => {
    let locale = getLocale();
    const a = {en: "en-US", pt_BR: "pt-BR"};
    a[locale]? locale = a[locale]: locale;
    return require('date-fns/locale/' + locale + '/index.js');
};

