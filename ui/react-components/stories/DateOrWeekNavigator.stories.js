import React from 'react'
import DateOrWeekNavigator from "../components/DateOrWeekNavigator/DateOrWeekNavigator";

export default { title: 'DateOrWeekNavigator' };

export const dayView = () => ( <DateOrWeekNavigator isWeek = {false}/> );

export const weekView = () => ( <DateOrWeekNavigator isWeek = {true} weekStart= {7}/> );