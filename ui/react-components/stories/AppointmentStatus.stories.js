import React, {useState} from 'react';
import AppointmentStatus from '../components/AppointmentStatus/AppointmentStatus.jsx';
import {IntlProvider} from "react-intl";

export default { title: 'Appointment Status' };

const withReactIntl = (AppointmentStatus) => {
    return (props) =>{
        return <IntlProvider locale='en' messages={{'Appointment_Status': 'no status selected'}}>
            <AppointmentStatus {...props}/>
        </IntlProvider>
    }
}

const InternationalizedAppointmentStatus=withReactIntl(AppointmentStatus)


export const basic = () => (<InternationalizedAppointmentStatus />);

