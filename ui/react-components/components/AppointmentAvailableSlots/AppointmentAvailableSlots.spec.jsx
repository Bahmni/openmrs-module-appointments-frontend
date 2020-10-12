import '@testing-library/jest-dom/extend-expect';
import {render} from "@testing-library/react";
import AppointmentAvailableSlots from "./AppointmentAvailableSlots.jsx";
import React from "react";

jest.mock('../../utils/CookieUtil');

describe('AppointmentAvailableSlots', () => {

    it('should render the component without prop', () => {
        const {container} = render(<AppointmentAvailableSlots/>);
        expect(container.querySelector('.appAvaSlots')).not.toBeNull();
    });

    it('should render the component even when props are null', () => {
        const {container} = render(<AppointmentAvailableSlots currentLoad={null} maxAppointmentsLimit={null}/>);
        expect(container.querySelector('.appAvaSlots')).not.toBeNull();
    });

    it('should not render any text if props are null', () => {
        const {container} = render(<AppointmentAvailableSlots currentLoad={null} maxAppointmentsLimit={null}/>);
        expect(container.querySelector('.yellow')).toBeNull();
    });

    it('should render the span with available slots if maxAppointmentsLimit is passed', () => {
        const {container} = render(<AppointmentAvailableSlots currentLoad={23} maxAppointmentsLimit={45}/>);
        expect(container.querySelector('.green')).not.toBeNull();
    });

    it('should not render the component with available slots if maxAppointmentsLimit is not passed', () => {
        const {container} = render(<AppointmentAvailableSlots currentLoad={23} maxAppointmentsLimit={null}/>);
        expect(container.querySelector('.green')).toBeNull();
    });

});

