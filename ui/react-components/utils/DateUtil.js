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

