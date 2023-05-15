import '@testing-library/jest-dom/extend-expect';
import {fireEvent,screen, waitForElement, render, wait, getByTestId} from "@testing-library/react";
import React from "react";
import {renderWithReactIntl} from '../../utils/TestUtil';
import AppointmentStatus from "./AppointmentStatus";

const appointmentStatusList = [
    { value: "Scheduled", label: "Scheduled" },
    { value: "CheckedIn", label: "CheckedIn" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Missed", label: "Missed" }
  ];

jest.mock('../../api/locationApi');
jest.mock('../../utils/CookieUtil');
const locationApi = require('../../api/locationApi');
let getAllByTagSpy;

describe('AppointmentStatus', () => {
   
    // placeholer check
    it('should display placeholder as "Enter Status Name"', async () => {
        const {getByText} = renderWithReactIntl(<AppointmentStatus/>);
        getByText('Enter Status Name');
    });

    //options are loaded or not
    it('On typing in Appoitment Status Search, Options get Loaded',()=>{
        const {container,getByText} = renderWithReactIntl(<AppointmentStatus/>);
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.change(inputBox,{target:{ value: "sc" } });
        expect(getByText("Scheduled")).toBeInTheDocument();
    });

    //onChange option , option rendered correctly (Tag)
    it('should call onChange when any Status is selected from dropdown',async()=>{
        const onChangeFn=jest.fn()
        const {container,getByText} = renderWithReactIntl(<AppointmentStatus onChange={onChangeFn}/>);
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.change(inputBox, {target: {value: "sc"}});
        await waitForElement(() => (container.querySelector('.bx--list-box__menu')));
        const option = getByText('Scheduled');
        fireEvent.click(option);
        expect(onChangeFn).toHaveBeenCalled();
       
    });

    it('should display Tag, when option selected from Dropdown',async()=>{
        const {container,getByText,getByTestId} = renderWithReactIntl(<AppointmentStatus/>);
        const inputBox = container.querySelector('.bx--text-input');
        fireEvent.change(inputBox, {target: {value: "sc"}});
        await waitForElement(() => (container.querySelector('.bx--list-box__menu')));
        const option = getByText('Scheduled');
        fireEvent.click(option);

        await wait();
        
        // const tagLabel = container.querySelector('.tagLabel');
        // Should get tag with name 
        expect(getByText('Scheduled')).toBeInTheDocument()

       
    });


    //After remove, option added back to dropdown op
    
});

