import React, { Fragment } from "react";

import "./AppointmentCalender.module.scss";

import data from './mockAppointmentsData.json'

const TimeSlot = ({ timeSlotLabel, providers, appoinmentSlots }) => {
    return (
        <Fragment>
            {[timeSlotLabel, null].map((time, index) => (
                <tr>
                    <td>{time}</td>
                    {providers.map(provider => (
                        <td
                            className="bordered-cell"
                            onClick={() => console.log(time)}
                        >
                            {
                                appoinmentSlots.map(appoinmentSlot => {
                                    return appoinmentSlot && ( appoinmentSlot.providers.length === 0 && provider === "[No Provider]" || appoinmentSlot.providers.map(e => e.name).indexOf(provider) > -1 )&& ( index === 0 && new Date(appoinmentSlot.startDateTime).getMinutes() <= 30 || index === 1 && new Date(appoinmentSlot.startDateTime).getMinutes() > 30) 
                                    ?  (() => {
                                        const top =  (22 / 30) * new Date(appoinmentSlot.startDateTime).getMinutes() + (index === 1 ? -22 : 0 ) + "px"
                                        const height = (22 / 30) * Math.round((appoinmentSlot.endDateTime - appoinmentSlot.startDateTime) / 60000) + "px"
                                            return <div className="appointment_label" style={{top,height, backgroundColor: hexToRgbA(appoinmentSlot.service.color, .7), borderColor: appoinmentSlot.service.color}}>
                                                {new Date(appoinmentSlot.startDateTime).toLocaleTimeString() + " - " + new Date(appoinmentSlot.endDateTime).toLocaleTimeString()}<br />
                                                {appoinmentSlot.patient.name} ({appoinmentSlot.patient.identifier})
                                            </div>
                                        })()
                                        : null
                                })
                            }
                        </td>
                    ))}
                </tr>
            ))}
        </Fragment>
    );
};


const AppointmentCalender = props => {
    const providers = (data.length > 0 ? [...new Set(data.flatMap(appoinment => appoinment.providers && appoinment.providers.length > 0 ? appoinment.providers.map(provider => provider.name ) : "[No Provider]"))] : [null]).sort(function (a, b) {
        if (a.toLowerCase() > b.toLowerCase()) {
            return -1;
        }
        if (b.toLowerCase() > a.toLowerCase()) {
            return 1;
        }
        return 0;
    })
    const appoinments = data
    return (
        <div>
            {appoinments.length === 0 ? (
                <div className="no_appointment">No Appointments Found</div>
            ) : null}
            {appoinments.length > 0 ? (
                <div className="provider_names">
                    <div>
                        {providers.map(provider => (
                            <div>{provider}</div>
                        ))}
                    </div>
                </div>
            ) : null}
            <table cellSpacing="0" className="calender">
                <tbody>
                    {[...Array(24).keys()].map(time => {
                        const appoinmentSlots = appoinments.filter(
                            appoinment =>
                                new Date(appoinment.startDateTime).getHours() === time
                        )
                        const timeSlotLabel = (time % 12 === 0 ? 12 : time % 12) + (time - 12 < 0 ? "am" : "pm");
                        return (
                            <TimeSlot
                                timeSlotLabel={timeSlotLabel}
                                providers={providers}
                                appoinmentSlots={appoinmentSlots}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

function hexToRgbA(hex, alpha){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',' + alpha + ')';
    }
    throw new Error('Bad Hex');
}


export default AppointmentCalender;
