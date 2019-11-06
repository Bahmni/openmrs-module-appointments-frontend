import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import AppointmentNotes from './AppointmentNotes.jsx';
import {render, fireEvent } from '@testing-library/react';

describe('Appointment Notes', () => {
   it('should call onChange when notes has entered',() => {
       const onChangeSpy =  jest.fn();
       const {container, getByText} = render(<AppointmentNotes onChange={onChangeSpy}/>);
       const inputBox = container.querySelector('.notes');
       fireEvent.change(inputBox, {target:{value:'someNotes'}});
       expect(onChangeSpy.mock.calls.length).toBe(1);
   });

   it('should set the text are with given value', () => {
       const onChangeSpy =  jest.fn();
       const {getByText} = render(<AppointmentNotes value='value' onChange={onChangeSpy}/>);
       getByText('value');
   });
});
