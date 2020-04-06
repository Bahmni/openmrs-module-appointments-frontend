import React, { Fragment } from "react";
import "./AppointmentCalender.module.scss";
import moment  from 'moment';


const TimeSlot = ({ timeSlotLabel, providers, appoinmentSlots, minutesDiff, onSelect, onClickAppoinment }) => {
    
    const timeDiff = minutesDiff / 2

    const getMinutesDiff = (strTime, endTime) => Math.round((strTime - endTime) / 60000)
    
    const handleTimeSlotClick = (timeSlotRowIndex, provider) => {
        const startTime = moment(timeSlotLabel,"h:mmA").add(timeDiff * timeSlotRowIndex  , "minutes").format("LTS")
        const endTime = moment(timeSlotLabel,"h:mmA").add(minutesDiff / Math.abs(2 - timeSlotRowIndex) , "minutes").format("LTS")
        return onSelect(startTime, endTime, provider)
    }

    return (
        <Fragment>
            {[timeSlotLabel, null].map((time, index) => (
                <tr key={`${timeSlotLabel}_${index}`} >
                    <td>{time && (minutesDiff % 60 === 0 ?  time.replace(".00","") : time.replace(".",":")) }</td>
                    {providers.map(provider => (
                        <td
                        key={`${timeSlotLabel}_${provider}_${index}`}
                        className="bordered-cell"
                        onClick={() => handleTimeSlotClick(index, provider)}
                        >
                            {
                                appoinmentSlots.map(appoinmentSlot => {
                                    const timeDiffInMin = getMinutesDiff(appoinmentSlot.endDateTime, appoinmentSlot.startDateTime)
                                    return appoinmentSlot && ( appoinmentSlot.providers.length === 0 && provider === "[No Provider]" || appoinmentSlot.providers.map(provider => provider.name).indexOf(provider) > -1 ) && ( index === 0 && timeDiffInMin <= timeDiff || index === 1 && timeDiffInMin > timeDiff) 
                                    ?  (() => {
                                            const top =  (22 / timeDiff) * new Date(appoinmentSlot.startDateTime).getMinutes() + (index === 1 ? -22 : 0 ) + "px"
                                            const height = (22 / timeDiff) * getMinutesDiff(appoinmentSlot.endDateTime, appoinmentSlot.startDateTime) + "px"
                                            const text = new Date(appoinmentSlot.startDateTime).toLocaleTimeString([], {timeStyle: 'short'}) + " - " + new Date(appoinmentSlot.endDateTime).toLocaleTimeString([], {timeStyle: 'short'}) + "\n" + appoinmentSlot.patient.name + " (" + appoinmentSlot.patient.identifier + ")" 
                                            return <div onClick={(e) => {e.stopPropagation(); onClickAppoinment(appoinmentSlot)}} key={appoinmentSlot.uuid} title={text} className="appointment_label" style={{top,height, backgroundColor: shadeColor(appoinmentSlot.service.color, 30), borderColor: appoinmentSlot.service.color}}>
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


const AppointmentCalender = ({hoursDiff = 3, appoinments, onSelect, startOfDay="9:30", endOfDay="17:30", onClickAppoinment}) => {
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
                                onClickAppoinment={onClickAppoinment}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};


const shadeColor = (color, percent) => {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}


export default AppointmentCalender;
