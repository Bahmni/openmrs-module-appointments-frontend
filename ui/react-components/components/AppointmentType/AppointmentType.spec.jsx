import React from 'react';
import {renderWithReactIntl} from '../../utils/TestUtil';
import AppointmentType from "./AppointmentType.jsx";


describe('Appointment type', () => {
    it('should render the Appointment Type component', () => {
        const {container, getByText, getByTestId} = renderWithReactIntl(<AppointmentType />);
        expect(getByText('Teleconsultation')).not.toBeNull();
        expect(container.querySelector('.bx--checkbox-label')).not.toBeNull();
        expect(getByTestId('add-tele-consultation')).not.toBeNull();
    });

    it('should disable the teleconsulting when isTeleconsultationDisabled is true', () => {
        const {container} = renderWithReactIntl(<AppointmentType isTeleconsultationDisabled={true}/>);
        expect(container.querySelectorAll('.bx--checkbox-label')[0]).not.toBeUndefined();
    });
});
