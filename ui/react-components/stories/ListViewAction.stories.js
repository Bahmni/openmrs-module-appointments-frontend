import CheckinAction from "../components/ListViewAction/CheckinAction";
import ListViewAction from "../components/ListViewAction/ListViewAction";
import {IntlProvider} from "react-intl";
import React from "react";


const messages = {
  "YES_KEY": "Yes",
  "NO_KEY": "No",
  "APPOINTMENT_STATUS_CHANGE_CONFIRM_MESSAGE": "Are you sure, you want to mark appointment as {toStatus}?"
};

export default {title: 'List View Actions'};
export const missed = () => <IntlProvider locale='en' messages={messages}><ListViewAction status="Missed"/></IntlProvider>;
export const checkin = () => <IntlProvider locale='en' messages={messages}><CheckinAction/></IntlProvider>;
export const complete = () => <IntlProvider locale='en' messages={messages}><ListViewAction status="Completed"/></IntlProvider>;
export const cancel = () => <IntlProvider locale='en' messages={messages}><ListViewAction status="Cancelled"/></IntlProvider>;
