import AppointmentEditorFooter from "./AppointmentEditorFooter.jsx";
import React from "react";
import {render} from '@testing-library/react';

describe('Appointment editor Footer Search', () => {
    it('should render Check and Save and Cancel buttons', () => {
        const {container, getByText} = render(<AppointmentEditorFooter checkAndSave={() => jest.fn()}/>);
        getByText('Cancel');
        getByText('Check and Save');
        expect(container.querySelectorAll('.button').length).toBe(2);
    });
});
