import React, { Fragment, useState } from "react";
import "./AppointmentCalender.module.scss";
import moment  from 'moment';
import  classNames  from 'classnames';
import {sortBy} from 'lodash'


const TimeSlot = ({ timeSlotLabel, providers, appoinmentSlots, minutesDiff, onSelect, onClickAppoinment, isMultiSelectEnable, getSelectedCell, selectedCells }) => {
    
    const timeDiff = minutesDiff / 2

    const getMinutesDiff = (strTime, endTime) => Math.round((strTime - endTime) / 60000)
    
    const handleTimeSlotClick = (timeSlotRowIndex, provider=null) => {
        const startTime = moment(timeSlotLabel,"h:mmA").add(timeDiff * timeSlotRowIndex  , "minutes").format("LTS")
        const endTime = moment(timeSlotLabel,"h:mmA").add(minutesDiff / Math.abs(2 - timeSlotRowIndex) , "minutes").format("LTS")
        return {startTime, endTime, provider}
    }

    return (
        <Fragment>
            {[timeSlotLabel, null].map((time, index) => (
                <tr key={`${timeSlotLabel}_${index}`} >
                    <td>{time && (minutesDiff % 60 === 0 ?  time.replace(".00","") : time.replace(".",":")) }</td>
                    {providers.map(provider => (
                        <td
                            provider={provider}
                            onMouseOver={isMultiSelectEnable ? () => getSelectedCell(handleTimeSlotClick(index), index) : () => {}}
                            key={`${timeSlotLabel}_${provider}_${index}`}
                            id={`${handleTimeSlotClick(index).startTime}_${handleTimeSlotClick(index).endTime}_${provider}_${index}`}
                            className={classNames("bordered-cell", {active: selectedCells.indexOf(handleTimeSlotClick(index).startTime + "_" + handleTimeSlotClick(index).endTime +"_"+provider+"_"+index) > -1})}
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

    const [multiSelect, setMultiSelect] = useState({enable: false, provider: null})

    const [selectedCells, setSelectedCells] = useState([])


    const getSelectedCell = ({startTime, endTime}, index) => {
        let currentSelectedCell = startTime + "_" + endTime + "_"+ multiSelect.provider + "_" + index
        if(selectedCells.indexOf(currentSelectedCell) > -1)
            setSelectedCells([...selectedCells.slice(0,selectedCells.indexOf(currentSelectedCell) + 1)])
        else if(selectedCells[0] && moment(selectedCells[0].split("_")[0], "h:mm:ssA").isAfter(moment(startTime, "h:mm:ssA"))){
            setSelectedCells([startTime + "_"+  endTime + "_" + multiSelect.provider + "_" + index, ...selectedCells])
            
        }
        else
            setSelectedCells([...selectedCells,startTime + "_"+  endTime + "_" + multiSelect.provider + "_" + index])
    }

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
            <table cellSpacing="0" className="calender-table"                         
                onMouseDown={(e) => {
                    setSelectedCells([e.target.id])
                    setMultiSelect({enable: true, provider: e.target.getAttribute("provider")})
                    }
                }
                onMouseUp={() => {
                        setMultiSelect({enable: false})
                        onSelect(selectedCells[0].split("_")[0], selectedCells.slice(-1)[0].split("_")[1], multiSelect.provider)
                        setSelectedCells([])
                    }
                }>
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
                                isMultiSelectEnable={multiSelect.enable}
                                getSelectedCell={getSelectedCell}
                                selectedCells={selectedCells.filter((selectedCell, index) => selectedCells.indexOf(selectedCell) === index)}
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
