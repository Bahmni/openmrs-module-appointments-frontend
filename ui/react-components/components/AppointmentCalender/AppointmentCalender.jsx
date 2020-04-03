import React, { Fragment } from "react";

import "./AppointmentCalender.module.scss";

const TimeSlot = ({ timeSlotLabel, providers, appoinmentSlots, minutesDiff, onSelect, isDisabled }) => {
    const timeDiff = minutesDiff / 2


    const getMinutesDiff = (strTime, endTime) => Math.round((strTime - endTime) / 60000)
    return (
        <Fragment>
            {[timeSlotLabel, null].map((time, index) => (
                <tr key={`${timeSlotLabel}_${index}`} >
                    <td>{time && (minutesDiff % 60 === 0 ?  time.replace(".00","") : time.replace(".",":")) }</td>
                    {providers.map(provider => (
                        <td
                            key={`${timeSlotLabel}_${provider}_${index}`}
                            className="bordered-cell"
                            onClick={() => 1}
                        >
                            {
                                appoinmentSlots.map(appoinmentSlot => {
                                    const timeDiffInMin = getMinutesDiff(appoinmentSlot.endDateTime, appoinmentSlot.startDateTime)
                                    return appoinmentSlot && ( appoinmentSlot.providers.length === 0 && provider === "[No Provider]" || appoinmentSlot.providers.map(provider => provider.name).indexOf(provider) > -1 ) && ( index === 0 && timeDiffInMin <= timeDiff || index === 1 && timeDiffInMin > timeDiff) 
                                    ?  (() => {
                                            const top =  (22 / timeDiff) * new Date(appoinmentSlot.startDateTime).getMinutes() + (index === 1 ? -22 : 0 ) + "px"
                                            const height = (22 / timeDiff) * getMinutesDiff(appoinmentSlot.endDateTime, appoinmentSlot.startDateTime) + "px"

                                            const text = new Date(appoinmentSlot.startDateTime).toLocaleTimeString([], {timeStyle: 'short'}) + " - " + new Date(appoinmentSlot.endDateTime).toLocaleTimeString([], {timeStyle: 'short'}) + "\n" + appoinmentSlot.patient.name + " (" + appoinmentSlot.patient.identifier + ")" 

                                            return <div key={appoinmentSlot.uuid} title={text} className="appointment_label" style={{top,height, backgroundColor: hexToRgbA(appoinmentSlot.service.color, .7), borderColor: appoinmentSlot.service.color}}>
                                                    {text}
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


const AppointmentCalender = ({hoursDiff = 3, appoinments, onSelect, startOfDay="9:30", endOfDay="17:30"}) => {
    const providers = (appoinments.length > 0 ? [...new Set(appoinments.flatMap(appoinment => appoinment.providers && appoinment.providers.length > 0 ? appoinment.providers.map(provider => provider.name ) : "[No Provider]"))] : [null]).sort(function (a, b) {
        if (a.toLowerCase() > b.toLowerCase()) return -1;
        if (b.toLowerCase() > a.toLowerCase()) return 1;
        return 0;
    })
    return (
        <div data-testid="appointment-calender" className="calender">
            {appoinments.length === 0 ? (
                <div className="no_appointment">No Appointments Found</div>
            ) : null}

            {
                (()=>{
                        const topModalHeight = (Number(startOfDay.split(':')[0]) * 60+Number(startOfDay.split(':')[1]) ) * (23/(30*hoursDiff))
                        const bottomModalHeight= ((24-Number(endOfDay.split(':')[0])) * 60 - Number(endOfDay.split(':')[1])) * (23/(30 * hoursDiff))
                        console.log(bottomModalHeight)
                        return <Fragment>
                                <div className="non-working-hrs-modal" style={{height:topModalHeight}}/>
                                <div className="non-working-hrs-modal" style={{height: bottomModalHeight,bottom:"0"}}/>
                        </Fragment>
                })()
            }
            <table cellSpacing="0" className="calender-table">
                {appoinments.length > 0 ? (
                    <thead>
                       <tr>
                            <td key={""}></td>
                            {providers.map(provider => (
                                <td key={provider}>{provider}</td>
                            ))}
                        </tr>
                    </thead>)
                    : null
                }
                <tbody>
                    {[...Array(24 / hoursDiff).keys()].map(time => {
                        const appoinmentSlots = appoinments.filter(
                            appoinment => {
                                const hours = new Date(appoinment.startDateTime).getHours()
                                return hours >= time  * hoursDiff && hours < (time + 1)  * hoursDiff
                            }
                        )
                        // making 0 as 12am and Handling minutes (conveting decimal to time format e.g. 0.50 => 12.30am) to handle configurable timeslot. 
                        let _timeSlotLabel = ((time * hoursDiff)) % 12
                        
                        _timeSlotLabel += _timeSlotLabel >= 0.00 && _timeSlotLabel < 1.00 ? 12 : 0

                        _timeSlotLabel = _timeSlotLabel.toFixed(2)
                        
                        const timeSlotLabel = (_timeSlotLabel.split(".")[1] > 0 ?  _timeSlotLabel.split(".")[0] + "." + Number(_timeSlotLabel.split(".")[1]) * 3 / 5 : _timeSlotLabel) + ((time * hoursDiff) - 12 < 0 ? "am" : "pm");
                        return (
                            <TimeSlot
                                key={timeSlotLabel}
                                timeSlotLabel={timeSlotLabel}
                                providers={providers}
                                appoinmentSlots={appoinmentSlots}
                                minutesDiff={hoursDiff * 60}
                                onSelect={onSelect}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const hexToRgbA = (hex, alpha) =>{
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',' + alpha + ')';
    }
    return hex;
}


export default AppointmentCalender;
