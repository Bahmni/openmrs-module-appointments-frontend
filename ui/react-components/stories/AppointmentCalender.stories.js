import React from 'react'

import AppointmentCalender from '../components/AppointmentCalender/AppointmentCalender';

import data from '../components/AppointmentCalender/mockAppointmentsData.json'

export default {
    title: 'Appointment Calender View',
}

export const Basic = () => <AppointmentCalender appoinments={data} hoursDiff={1}/>