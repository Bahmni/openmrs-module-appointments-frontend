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

    it('should display the patient search', () => {
        const {container, getByTestId} = renderWithReactIntl(<AppointmentEditor/>);
        expect(container.querySelector('.searchFieldsContainer')).not.toBeNull();
        expect(getByTestId('asyncSelect')).not.toBeNull();
    });

    it('should display the all components search except speciality', function () {
        const {container, getAllByTestId} = renderWithReactIntl(<AppointmentEditor/>);
        expect(container.querySelector('.searchFieldsContainer')).not.toBeNull();

        expect(container.querySelector('.searchFieldsContainerLeft')).not.toBeNull();
        expect(container.querySelector('.searchFieldsContainerLeft').children.length).toBe(4);
        expect(container.querySelector('.searchFieldsContainerRight')).not.toBeNull();
        expect(container.querySelector('.searchFieldsContainerRight').children.length).toBe(1);
        expect(getAllByTestId('select').length).toBe(4);
    });

    it('should display the all components search', function () {
        const config = {
            "enableSpecialities": "true"
        };
        const {container, getAllByTestId} = renderWithReactIntl(<AppointmentEditor appConfig={config}/>);
        expect(container.querySelector('.searchFieldsContainer')).not.toBeNull();
        expect(container.querySelector('.searchFieldsContainerLeft')).not.toBeNull();
        expect(container.querySelector('.searchFieldsContainerLeft').children.length).toBe(5);
        expect(container.querySelector('.searchFieldsContainerRight')).not.toBeNull();
        expect(container.querySelector('.searchFieldsContainerRight').children.length).toBe(1);
        expect(getAllByTestId('select').length).toBe(5);
    });
});

