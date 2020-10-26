import React from 'react';
import {renderWithReactIntl} from '../../utils/TestUtil';
import AppointmentType from "./AppointmentType.jsx";
import {fireEvent} from '@testing-library/react';


describe('Appointment type', () => {
    it('should render the Appointment Type component', () => {
        const {container, getByText} = renderWithReactIntl(<AppointmentType />);
        expect(getByText('Appointment Type')).not.toBeNull();
        expect(getByText('Teleconsultation')).not.toBeNull();
        expect(container.querySelector('.checkbox')).not.toBeNull();
        expect(container.querySelector('.checkboxContainer')).not.toBeNull();
    });

    it('should disable the teleconsulting when isTeleconsultationDisabled is true', () => {
        const {container} = renderWithReactIntl(<AppointmentType isTeleconsultationDisabled={true}/>);
        expect(container.querySelectorAll('.rc-checkbox-disabled')[0]).not.toBeUndefined();
        expect(container.querySelectorAll('.disabledLabelContainer')[0]).not.toBeUndefined();
    });
});
