import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { getByTestId, getByText } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import AppointmentCalender from './AppointmentCalender';

import data from './mockAppointmentsData.json'

describe("<AppointmentCalender />", () => {
    it("should render AppointmentCalender component", () => {
        const {container} = render(
            <AppointmentCalender appoinments={[]} />
        );
        expect(getByTestId(container, "appointment-calender")).toBeTruthy()
    })

    it("should show no appointment when empty object" ,() => {
        const {getByText} = render(
            <AppointmentCalender appoinments={[]} />
        );
        expect(getByText("No Appointments Found"))   
    })

    it("should render appointment labels", () => {
        const {container} = render(
            <AppointmentCalender appoinments={data} />
        );
        expect(container.getElementsByClassName("appointment_label").length).toEqual(5)
    })

    it("should work for configurable time slots", () => {
        const {container, rerender} = render(
            <AppointmentCalender appoinments={[]} hoursDiff={1}/>
        );

        expect(container.getElementsByTagName("tbody")[0].childNodes.length / 2).toEqual(24)

        rerender(<AppointmentCalender appoinments={[]} hoursDiff={2}/>)

        expect(container.getElementsByTagName("tbody")[0].childNodes.length / 2).toEqual(12)

        rerender(<AppointmentCalender appoinments={[]} hoursDiff={3}/>)

        expect(container.getElementsByTagName("tbody")[0].childNodes.length / 2).toEqual(8)

    })

    it("should show providers properly", () => {
        const {container} = render(
            <AppointmentCalender appoinments={data} hoursDiff={1}/>
        );

        expect(container.querySelector("thead>tr").childNodes.length - 1).toEqual(4)
        
    })

    it("should call onSelectAppointment on clicking appointment label", () => {
        const onClickAppoinment = jest.fn()
        const {container} = render(
            <AppointmentCalender appoinments={data} hoursDiff={1} onClickAppoinment={onClickAppoinment}/>
        );
        fireEvent.click(container.getElementsByClassName("appointment_label")[0])
        expect(onClickAppoinment).toHaveBeenCalledTimes(1)
    })
})

