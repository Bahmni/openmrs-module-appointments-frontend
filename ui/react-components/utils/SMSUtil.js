import _ from 'lodash'
import {isVirtual} from "../components/AddAppointment/AddAppointment.jsx";
import { 
    enableAppointmentBookingSMSAlert,
    messageType,
    clinicName
} from "../config";

export const isAppointmentSMSEnabled = (appConfig) => {
    return appConfig.enableAppointmentBookingSMSAlert || enableAppointmentBookingSMSAlert;
};

const getMessage = (data, message, clinic, recurring = null) => {
    message = message.replace("#clinicName", clinic || clinicName);
    message = message.replace("#patientId", data.patient.identifier);
    message = message.replace("#patientName", data.patient.name);
    message = message.replaceAll("#dateTime", new Date(data.startDateTime).toLocaleString());
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
    return getMessage(apptData, messageTemplate, appConfig["clinicName"]);
};

export const getRecurringAppointmentBookingMessage = (apptData, appConfig, intl) => {
    var type = getAppointmentMessageType(apptData.appointmentDefaultResponse, apptData.recurringPattern);
    var messageTemplate = getMessageTranslation(appConfig, intl, type);
    return getMessage(apptData.appointmentDefaultResponse, messageTemplate, appConfig["clinicName"], apptData.recurringPattern);
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
