import React from 'react'
import ListView from './ListView'
import { render, fireEvent } from '@testing-library/react'
import { missedAppointment, cancelledAppointment } from './ListView.module.scss'
import { toHaveClass } from '@testing-library/jest-dom/extend-expect'

describe('List View Component', () => {

    it('renders ListView with no appointments correctly', () => {
        const { asFragment } = render(<ListView />)

        expect(asFragment()).toMatchSnapshot()
    })

    const columns = {
        "Patient ID": "",
        "Patient Name": "mid",
        "Date": "",
        "Start Time": "",
        "End Time": "",
        "Provider": "mid",
        "Speciality": "",
        "Service": "mid",
        "Service Appointment Type": "mid",
        "Status": "",
        "Walk In": "",
        "Location": "mid",
        "Additional Info": "mid",
        "Notes": ""
    }

    const rows = [
        {
            "Patient ID": "GAN203012",
            "Patient Name": "Test Diabetes",
            "Date": "24 Mar 20",
            "Start Time": "10:00 am",
            "End Time": "10:30 am",
            "Provider": "",
            "Speciality": "Cardiology",
            "Service": "Cardiology",
            "Service Appointment Type": "",
            "Status": "Scheduled",
            "Walk In": "Yes",
            "Location": "OPD-1",
            "Additional Info": "",
            "Notes": "",
        },
        {
            "Patient ID": "GAN203011",
            "Patient Name": "Test Con",
            "Date": "24 Mar 20",
            "Start Time": "9:00 am",
            "End Time": "9:30 am",
            "Provider": "",
            "Speciality": "Cardiology",
            "Service": "Cardiology",
            "Service Appointment Type": "",
            "Status": "Scheduled",
            "Walk In": "Yes",
            "Location": "OPD-1",
            "Additional Info": "",
            "Notes": "Urgent",
        },
        {
            "Patient ID": "GAN203019",
            "Patient Name": "Test Con",
            "Date": "22 Mar 20",
            "Start Time": "11:00 am",
            "End Time": "11:30 am",
            "Provider": "",
            "Speciality": "Psychology",
            "Service": "Psychology",
            "Service Appointment Type": "",
            "Status": "Scheduled",
            "Walk In": "Yes",
            "Location": "General Ward",
            "Additional Info": "",
            "Notes": "Nothing important",
        }
    ]

    it('renders ListView with appointments correctly', () => {
        const { asFragment } = render(<ListView columns={columns} rows={rows} />)

        expect(asFragment()).toMatchSnapshot()
    })

    it('renders ListView with background colors based on status', () => {
        const coloredRows = [
            { ...rows[0], "Status": "Missed" },
            { ...rows[1], "Status": "Cancelled" },
            { ...rows[2], "Status": "Scheduled" }]
        const { asFragment } = render(<ListView columns={columns} rows={coloredRows} colorRow={(appointment) => {
            const statusToColor = { "Missed": missedAppointment, "Cancelled": cancelledAppointment }
            return statusToColor[appointment.Status]
        }} />)

        expect(asFragment()).toMatchSnapshot()
    })


    it('should sort records ascending wrt column and display icon on click of column header', () => {
        rows[0]["Patient Name"] = "Antony"
        rows[1]["Patient Name"] = "Zenia"
        rows[2]["Patient Name"] = "Ramesh"
        const { getByText, container } = render(<ListView columns={columns} rows={rows} />)

        fireEvent.click(getByText('Patient Name'))
        expect(getByText("Patient Name").childNodes[1]).toHaveClass("svg-inline--fa fa-caret-up fa-w-10 sortIcon")

        const tableBody = container.querySelector("tbody")
        expect(tableBody.children[0].childNodes[1].textContent).toBe("Antony")
        expect(tableBody.children[1].childNodes[1].textContent).toBe("Ramesh")
        expect(tableBody.children[2].childNodes[1].textContent).toBe("Zenia")
    })

    it('should sort records descending wrt column and display icon on click of column header', () => {
        rows[0]["Patient Name"] = "Antony"
        rows[1]["Patient Name"] = "Zenia"
        rows[2]["Patient Name"] = "Ramesh"
        const { getByText, getByTestId, container } = render(<ListView columns={columns} rows={rows} />)

        fireEvent.click(getByText('Patient Name'))
        fireEvent.click(getByTestId("sortIcon"))

        expect(getByText("Patient Name").childNodes[1]).toHaveClass("svg-inline--fa fa-caret-down fa-w-10 sortIcon")

        const tableBody = container.querySelector("tbody")
        expect(tableBody.children[0].childNodes[1].textContent).toBe("Zenia")
        expect(tableBody.children[1].childNodes[1].textContent).toBe("Ramesh")
        expect(tableBody.children[2].childNodes[1].textContent).toBe("Antony")
    })

    it('should sort records in descending if previous column based sorting was descending', () => {
        rows[0]["Patient ID"] = "GAN00012"
        rows[1]["Patient ID"] = "GAN00020"
        rows[2]["Patient ID"] = "GAN00001"
        const { getByText, getByTestId, container } = render(<ListView columns={columns} rows={rows} />)

        fireEvent.click(getByText('Patient Name'))
        fireEvent.click(getByTestId("sortIcon"))
        expect(getByText("Patient Name").childNodes[1]).toHaveClass("svg-inline--fa fa-caret-down fa-w-10 sortIcon")
        fireEvent.click(getByText('Patient ID'))

        expect(getByText("Patient Name").childNodes.length).toEqual(1)
        expect(getByText("Patient ID").childNodes[1]).toHaveClass("svg-inline--fa fa-caret-down fa-w-10 sortIcon")
        const tableBody = container.querySelector("tbody")
        expect(tableBody.children[0].childNodes[0].textContent).toBe("GAN00020")
        expect(tableBody.children[1].childNodes[0].textContent).toBe("GAN00012")
        expect(tableBody.children[2].childNodes[0].textContent).toBe("GAN00001")
    })

    it('should select an appointment if it is clicked and deselect if another is selected', () => {
        const { container } = render(<ListView columns={columns} rows={rows} />)
        const row1Appointment = container.querySelector("tbody").children[0]
        const row2Appointment = container.querySelector("tbody").children[1]

        fireEvent.click(row1Appointment)
        expect(row1Appointment).toHaveClass('selected')

        fireEvent.click(row2Appointment)
        expect(row2Appointment).toHaveClass('selected')
        expect(row1Appointment).not.toHaveClass('selected')
    })

})
