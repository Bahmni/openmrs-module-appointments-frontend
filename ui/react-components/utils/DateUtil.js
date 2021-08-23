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

export const isValidUSDate= (dateValue) =>{
    let selectedDate = dateValue;
    if (selectedDate == '' || _.isNil(selectedDate))
        return false;

    let regExp = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
    var dateArray = selectedDate.match(regExp);

    if (dateArray == null) {
        return false;
    }

    let month = dateArray[1];
    let day = dateArray[3];
    let year = dateArray[5];

    if (month < 1 || month > 12) {
        return false;
    } else if (day < 1 || day > 31) {
        return false;
    } else if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) {
        return false;
    } else if (month == 2) {
        var isLeapYear = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
        if (day > 29 || (day == 29 && !isLeapYear)) {
            return false
        }
    }
    return true;
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

