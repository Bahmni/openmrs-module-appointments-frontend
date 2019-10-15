import React from 'react';
import { shallow } from 'enzyme';
import {AllAppointmentServices} from './AllAppointmentServices';

describe('Services', ()=>{

    let service = [{
        "Service Name": "Cardiology",
        "Location":"",
        "Speciality":"Cardiology",
        "Duration":"45 min",
        "Description":"ok"
        
      },{
      "Service Name": "Chemotherapy",
      "Location":"25 min",
      "Speciality":"Unkown location",
      "Duration":"45 min",
      "Description":"ok"
      }]

    let mockEditService= jest.fn();
    let mockDeleteService= jest.fn();
    let mountedApp = shallow(<AllAppointmentServices services={service} editService={mockEditService} removeService={mockDeleteService} />);
  

    it('should render a <table />', () => {
        expect(mountedApp.find('table').length).toEqual(1);
    });

    it('should edit service in allServices', () => {
        mountedApp.find('#editservice').first().simulate('click', mockEditService);
        expect(mockEditService).toBeCalledTimes(1);
    });
  
    it('should delete service in allServices', () => {
        mountedApp.find('#deleteservice').first().simulate('click', mockDeleteService);
        expect(mockDeleteService).toBeCalledTimes(1);
    });

    it('should render a <thead />',()=>{
        expect(mountedApp.find('thead').length).toEqual(1);
    });

    it('should render a <tbody />',()=>{
        expect(mountedApp.find('tbody').length).toEqual(1);
    });

});