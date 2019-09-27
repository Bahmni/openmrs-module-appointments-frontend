import {render} from "@testing-library/react";
import React from "react";
import {AppointmentEditor} from './AppointmentEditor.jsx';

describe('Appointment Editor', () => {
    it('should render an editor', () => {
        const {container} = render(<AppointmentEditor/>);
        expect(container.hasChildNodes()).toBeTruthy();
    });

    it('should have an overlay div', () => {
        const {getByTestId} = render(<AppointmentEditor/>);
        expect(getByTestId('overlay')).not.toBeNull();
    });

    it('should have an appointment-editor div', () => {
        const {getByTestId} = render(<AppointmentEditor/>);
        expect(getByTestId('appointment-editor')).not.toBeNull();
    });
});
