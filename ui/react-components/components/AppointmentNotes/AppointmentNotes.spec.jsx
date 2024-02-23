import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import AppointmentNotes from './AppointmentNotes.jsx';
import { fireEvent } from '@testing-library/react';
import {renderWithReactIntl} from "../../utils/TestUtil";

describe('Appointment Notes', () => {
   it('should call onChange when notes has entered',() => {
       const onChangeSpy =  jest.fn();
       const {container, getByText} = renderWithReactIntl(<AppointmentNotes onChange={onChangeSpy}/>);
       const inputBox = container.querySelector('.bx--text-area');
       fireEvent.blur(inputBox, {target:{value:'someNotes'}});
       expect(onChangeSpy.mock.calls.length).toBe(1);
   });

   it('should set the text are with given value', () => {
       const onChangeSpy =  jest.fn();
       const {getByText} = renderWithReactIntl(<AppointmentNotes value='value' onChange={onChangeSpy}/>);
       getByText('value');
   });

   it('should display default value for placeholder and maxLength', () => {
       const placeHolderKey = "PLACEHOLDER_APPOINTMENT_NOTES_MAX_LENGTH";
       const defaultValue = "Maximum of 250 characters";
       const onChangeSpy = jest.fn();
       const {container} = renderWithReactIntl(<AppointmentNotes onChange={onChangeSpy}
                                                                 placeHolderTranslationKey={placeHolderKey}
                                                                 placeHolderDefaultMessage={defaultValue}/>);
       const textArea = container.querySelector('.bx--text-area');
       expect(textArea.placeholder).toBe("Maximum of 250 characters");
       expect(textArea.maxLength).toBe(250);
   });
});
