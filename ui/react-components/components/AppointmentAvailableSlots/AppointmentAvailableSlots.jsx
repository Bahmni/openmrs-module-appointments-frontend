import React from "react";
import classNames from "classnames";
import {appAvaSlots, green, blue, yellow} from './AppointmentAvailableSlots.module.scss';

import PropTypes from "prop-types";

const AppointmentAvailableSlots = ({currentLoad, maxAppointmentsLimit, messages}) => (

    <div className={classNames(appAvaSlots)}>
        { currentLoad || maxAppointmentsLimit || (maxAppointmentsLimit && currentLoad) &&
        <div>
            {maxAppointmentsLimit &&
            <span>
                <span className={classNames(green)}>
                    {(maxAppointmentsLimit - currentLoad) + ' ' + messages.APPOINTMENT_CREATE_SLOT + ' ' + messages.APPOINTMENT_CREATE_AVAL}
                </span>
                {' ' + messages.APPOINTMENT_CREATE_OUTOF}
                <span className={classNames(blue)}> {maxAppointmentsLimit} {' ' + messages.APPOINTMENT_CREATE_SLOT} </span>
                { maxAppointmentsLimit && currentLoad &&
                <span>{', '}</span>
                }
            </span>
            }
            {currentLoad &&
            <span className={classNames(yellow)}>
                {currentLoad} {' ' + messages.APPOINTMENT_CREATE_SLOT} {' ' + messages.APPOINTMENT_CREATE_BOOKED}
            </span>
            }
        </div>
        }
    </div>
);

AppointmentAvailableSlots.propTypes = {
    currentLoad: PropTypes.number,
    maxAppointmentsLimit: PropTypes.number,
    messages: PropTypes.object
};

export default AppointmentAvailableSlots;

