import React from "react";
import {AppointmentEditor} from './AppointmentEditor.jsx';
import {renderWithReactIntl} from '../../utils/TestUtil';

describe('Appointment Editor', () => {
    it('should render an editor', () => {
        const {container} = renderWithReactIntl(<AppointmentEditor/>);
        expect(container.hasChildNodes()).toBeTruthy();
    });

    it('should have an appointment-editor div', () => {
        const {getByTestId} = renderWithReactIntl(<AppointmentEditor/>);
        expect(getByTestId('appointment-editor')).not.toBeNull();
    });

    it('should display the paitent search', () => {
        const {container, getByTestId} = renderWithReactIntl(<AppointmentEditor/>);
        expect(container.querySelector('.searchFieldsContainer')).not.toBeNull();
        expect(getByTestId('asyncSelect')).not.toBeNull();
    });
});

