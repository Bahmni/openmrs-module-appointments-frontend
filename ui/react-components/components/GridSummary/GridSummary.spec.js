import React from "react";
import {fireEvent} from '@testing-library/react';
import {renderWithReactIntl} from '../../utils/TestUtil';
import '@testing-library/jest-dom/extend-expect';
import GridSummary, { transformAppointmentsData, transformAppointmentSummaryToGridData } from "./GridSummary";
import data from './AppointSummary.json'

describe("Grid Summary",()=>{
    it("should render table for grid summary",()=>{
        const {container} = renderWithReactIntl(<GridSummary gridData={transformAppointmentSummaryToGridData(data)}/>);
        expect(container.querySelector('.tableGridSummary')).toBeInTheDocument()

    });

    it("should contain service label in table for grid summary",()=>{
        const {getByText} = renderWithReactIntl(<GridSummary gridData={transformAppointmentSummaryToGridData(data)}/>);
        expect(getByText('Total')).toBeInTheDocument()

    });

    it('onClick function should get called on count click',()=>{
        const clickHandler=jest.fn()
        const {container} = renderWithReactIntl(<GridSummary gridData={transformAppointmentSummaryToGridData(data)} onClick={clickHandler}/>);
        const count=container.querySelector('a')
        fireEvent.click(count)
        expect(clickHandler).toHaveBeenCalledTimes(1)
    })

    it('Should not render data-rows, when data is empty',()=>{
        const {queryByTestId} = renderWithReactIntl(<GridSummary gridData={[]}/>);
        expect(queryByTestId('row')).toBeNull()
    })
})

describe('Transform Appointments data', () => {
    const data = [
        {
            "uuid": "695dfd06-8ffb-4c7a-a535-83202f5b0668",
            "appointmentNumber": "0000",
            "patient": {
                "identifier": "ABC200000",
                "gender": "M",
                "name": "Abc A B",
                "uuid": "22dbd669-d0ff-424c-b1fc-12013b5655f4",
                "age": 23,
                "PatientIdentifier": "ABC200000"
            },
            "service": {
                "appointmentServiceId": 5,
                "name": "ENT Follow-up Consultation",
                "description": "Appointment for ENT Follow-up",
                "speciality": {
                    "name": "ENT",
                    "uuid": "8c988914-8f98-4333-ae51-4da92f5cad27"
                },
                "startTime": "",
                "endTime": "",
                "maxAppointmentsLimit": null,
                "durationMins": 15,
                "location": {},
                "uuid": "389012ba-8471-4f73-88a0-fbc742448f11",
                "color": null,
                "initialAppointmentStatus": null,
                "creatorName": null
            },
            "serviceType": null,
            "provider": null,
            "location": {
                "name": "OPD-1",
                "uuid": "c58e12ed-3f12-11e4-adec-0800271c1b75"
            },
            "startDateTime": 1682322300000,
            "endDateTime": 1682323200000,
            "appointmentKind": "Scheduled",
            "status": "Scheduled",
            "comments": null,
            "additionalInfo": null,
            "teleconsultation": null,
            "providers": [
                {
                    "uuid": "9cd23277-cf8c-11ed-8f48-0242ac13000d",
                    "comments": null,
                    "response": "ACCEPTED",
                    "name": "Super Man"
                }
            ],
            "voided": false,
            "extensions": {
                "patientEmailDefined": false
            },
            "teleconsultationLink": null,
            "recurring": false
        },
    ]
    const [ actualSpeciality, actualProviders, actualLocations]  = transformAppointmentsData(data);

    const expectedSpeciality = [{
        rowLabel: 'ENT',
        rowDataList: [{date: '2023-04-24', uuid: "8c988914-8f98-4333-ae51-4da92f5cad27", count: 1, missedCount: 0}]
    }];
    const expectedProviders = [{
        rowLabel: 'Super Man',
        rowDataList: [{date: '2023-04-24', uuid: "9cd23277-cf8c-11ed-8f48-0242ac13000d", count: 1, missedCount: 0}]
    }];
    const expectedLocations = [{
        rowLabel: 'OPD-1',
        rowDataList: [{date: '2023-04-24', uuid: "c58e12ed-3f12-11e4-adec-0800271c1b75", count: 1, missedCount: 0}]
    }];
    expect(actualSpeciality).toEqual(expectedSpeciality)
    expect(actualProviders).toEqual(expectedProviders)
    expect(actualLocations).toEqual(expectedLocations)
})
