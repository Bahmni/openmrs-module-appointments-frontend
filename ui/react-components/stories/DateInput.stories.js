import React, { useState } from 'react';
import DateInput from '../components/DatePicker/DateInput.jsx';
import moment from "moment";

export default { title: 'Date Input' };

export const basic = () => (<DateInput value={moment().format('DD/MMM/YYYY')}></DateInput>);

export const withOnBlur = () => (<DateInput value={moment().format('DD/MMM/YYYY')}></DateInput>);