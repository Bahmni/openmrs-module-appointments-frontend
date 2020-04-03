import ListView from '../components/ListView/ListView'
import React from 'react'
export default { title: 'List View' };

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

export const withAppointments = () => (<ListView columns={columns} rows={rows}></ListView>);

export const withoutAppointments = () => (<ListView columns={columns} rows={[]}></ListView>);
