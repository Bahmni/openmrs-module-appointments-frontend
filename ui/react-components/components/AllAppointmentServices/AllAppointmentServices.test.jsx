import React from 'react';
import {render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import AllAppointmentServices from './AllAppointmentServices';


describe('AllAppointmentServices', ()=>{

        let service = [{
                "Service Name": "Cardiology",
                "Location":"",
                "Speciality":"Cardiology",
                "Duration":"45 min",
                "Description":"ok"
                
              },{
              "Service Name": "Chemotherapy",
              "Location":"25 min",
              "Speciality":"Unkown location",
              "Duration":"45 min",
              "Description":"ok"
              }]
        

     
    
        it('should render a <table />', () => {   
            const {container} = render(<AllAppointmentServices services={service}  />);     
            expect(container.querySelectorAll('table').length).toBe(1);
          
        });

        it('should render a <thead />',()=>{
            const {container} = render(<AllAppointmentServices services={service}  />);
            expect(container.querySelectorAll('thead').length).toBe(1);
        });

        it('should render a <tbody />',()=>{
            const {container} = render(<AllAppointmentServices services={service} />);
            expect(container.querySelectorAll('tbody').length).toBe(1);
        });

        it('should edit service in allServices', () => {
            let mockEditService= jest.fn();
            const {container, getAllByText} = render(<AllAppointmentServices services={service} editService={mockEditService}  />);
            const editLink = getAllByText('Edit');
            fireEvent.click(container, editLink);
            expect(mockEditService).toHaveBeenCalledTimes(1);
        });
      
        it('should delete service in allServices', () => {      
            let mockDeleteService= jest.fn();
            const {container, getAllByTestId} = render(<AllAppointmentServices services={service} removeService={mockDeleteService} />);
            const deleteLink = getAllByTestId('deleteservice');
            fireEvent.click(container, deleteLink);
            expect(mockDeleteService).toHaveBeenCalledTimes(1);;
        });
});