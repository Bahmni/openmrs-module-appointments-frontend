import _ from 'lodash'
import {isVirtual} from "../components/AddAppointment/AddAppointment.jsx";
import {messageType} from "../config";
import {getPersonAttribute} from "../api/patientApi";
import {currentLocation} from "./CookieUtil";
import {getHelpDeskNumber} from "./LocalStorageUtil";

const getMessage = (data, message, recurring = null) => {
    message = message.replace("#clinicName", currentLocation().name);
    message = message.replace("#patientId", data.patient.identifier);
    message = message.replace("#patientName", data.patient.name);
    message = message.replaceAll("#dateTime", new Date(data.startDateTime).toLocaleString());
    message = message.replace("#helpDeskNumber", getHelpDeskNumber());
    message = message.replace("#service", data.service.name);
    if (recurring) {
        message = message.replace("#frequency", (recurring.period + " " + recurring.type.toLowerCase() + (recurring.daysOfWeek ? " on " + recurring.daysOfWeek.map(_.capitalize).join(", ") : "")));
    }
    message = message.replace("#meetingLink", data.teleconsultationLink);
    return message;
};

export const getAppointmentBookingMessage = (apptData, appConfig, intl) => {
    var type = getAppointmentMessageType(apptData);
    var messageTemplate = getMessageTranslation(appConfig, intl, type);
    return getMessage(apptData, messageTemplate);
};

export const getRecurringAppointmentBookingMessage = (apptData, appConfig, intl) => {
    var type = getAppointmentMessageType(apptData.appointmentDefaultResponse, apptData.recurringPattern);
    var messageTemplate = getMessageTranslation(appConfig, intl, type);
    return getMessage(apptData.appointmentDefaultResponse, messageTemplate, apptData.recurringPattern);
};

const getMessageTranslation = (appConfig, intl, type) => {
    return intl.formatMessage({id: appConfig[type], defaultMessage: messageType[type]});
};

const getAppointmentMessageType = (apptData, isRecurring = null) => {
    if (isVirtual(apptData)) {
        return "teleconsultationAppointmentBookingMessage";
    } 
    return isRecurring ? "recurringAppointmentBookingMessage" : "appointmentBookingMessage";
};

export const getPhoneNumber = async (patientUuid, attribute) => {
    var phoneNumber = await getPersonAttribute(patientUuid, attribute)
    return phoneNumber ? encodeURIComponent(phoneNumber) : null;
};
