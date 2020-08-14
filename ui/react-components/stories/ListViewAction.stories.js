import CheckinAction from "../components/ListViewAction/CheckinAction";
import MissedAction from "../components/ListViewAction/MissedAction";
import CompleteAction from "../components/ListViewAction/CompleteAction";
import CancelAction from "../components/ListViewAction/CancelAction";
import {IntlProvider} from "react-intl";
import React from "react";


const messages = {
  "YES_KEY": "Yes",
  "NO_KEY": "No",
  "APPOINTMENT_STATUS_CHANGE_CONFIRM_MESSAGE": "Are you sure, you want to mark appointment as {toStatus}?"
};

export default {title: 'List View Actions'};
export const missed = () => <IntlProvider locale='en' messages={messages}><MissedAction/></IntlProvider>;
export const checkin = () => <IntlProvider locale='en' messages={messages}><CheckinAction/></IntlProvider>;
export const complete = () => <IntlProvider locale='en' messages={messages}><CompleteAction/></IntlProvider>;
export const cancel = () => <IntlProvider locale='en' messages={messages}><CancelAction/></IntlProvider>;
