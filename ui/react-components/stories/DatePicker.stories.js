import React from 'react';
import DatePicker from '../components/DatePicker/DatePicker';
import {IntlProvider} from "react-intl";
import moment from "moment";

export default { title: 'DatePicker' };

export const withValueToday = () => <DatePicker value={moment().toDate()}></DatePicker>

export const withDisabledCalendar = () => <DatePicker value={moment().toDate()} isDisabled={true}></DatePicker>