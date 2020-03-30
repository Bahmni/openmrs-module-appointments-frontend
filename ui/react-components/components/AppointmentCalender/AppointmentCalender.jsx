import React, { Fragment } from "react";

import "./AppointmentCalender.module.scss";

const TimeSlot = ({ time, providers }) => {
    const timeSlotLabel =
        (time % 12 === 0 ? 12 : time % 12) + (time - 12 < 0 ? "am" : "pm");
    return (
        <Fragment>
            {[timeSlotLabel, null].map(time => (
                <tr>
                    <td>{time}</td>
                    {providers.map(_ => (
                        <td
                            className="bordered-cell"
                            onClick={() => console.log(time)}
                        ></td>
                    ))}
                </tr>
            ))}
        </Fragment>
    );
};
const AppointmentCalender = props => {
    const providers = ["John Deo", "Elon Musk"];
    return (
        <div>
            <table cellSpacing="0" className="calender">
                {[...Array(24).keys()].map(time => (
                    <TimeSlot time={time} providers={providers} />
                ))}
            </table>
        </div>
    );
};

export default AppointmentCalender;
