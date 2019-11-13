import React from "react";
import ConflictsBody from "./ConflictsBody";
import {renderWithReactIntl} from "../../../utils/TestUtil";


describe('Conflicts Body', () => {

    const messages = {
        'OVERLAPPING_CONFLICTS': 'Patient double booking',
        'NO_SERVICE_DATE_CONFLICTS': 'Service unavailability'
    };
    const service = {label: 'Orthopedic'};

    it('should render patient double booking and service unavailable tabs', function () {
        const conflicts = {
            SERVICE_UNAVAILABLE: [{service: {name: "Dressing"}, uuid: "uuid"}],
            PATIENT_DOUBLE_BOOKING: [{service: {name: "Dressing"}, uuid: "uuid"}]
        };

        const {getByText} = renderWithReactIntl(<ConflictsBody conflicts={conflicts} service={service}/>, messages);

        expect(getByText("Patient double booking")).not.toBeNull();
        expect(getByText("Service unavailability")).not.toBeNull();
    });

    it('should render patient double booking tab', function () {
        const conflicts = {PATIENT_DOUBLE_BOOKING: [{service: {name: "Dressing"}, uuid: "uuid"}]};

        const {getByText} = renderWithReactIntl(<ConflictsBody conflicts={conflicts} service={service}/>, messages);

        expect(getByText("Patient double booking")).not.toBeNull();
    });

    it('should not render any tabs if conflicts don\'t exist', function () {
        const conflicts = {};

        const {queryByText} = renderWithReactIntl(<ConflictsBody conflicts={conflicts} service={service}/>, messages);

        expect(queryByText('Overlapping conflicts')).toBeNull();
        expect(queryByText('No-Service Date conflicts')).toBeNull();
    });

    it('should render patient double booking conflicts content', () => {
        const conflicts = {PATIENT_DOUBLE_BOOKING: [{service: {name: "Dressing"}, startDateTime: 1575561600000}]};
        const {container, getByText} = renderWithReactIntl(<ConflictsBody conflicts={conflicts} service={service}/>);

        getByText('The recurring appointments you are trying to book overlaps with the following dates');
        getByText('5th December ‘19 | Thursday | 4:00 PM');
        expect(container.querySelector('.conflictMessage').innerHTML).toContain('Current Orthopedic request');
        expect(container.querySelector('.boldContent').innerHTML).toContain('conflicts with Dressing');
    });

    it('should render service conflicts content', () => {
        const conflicts = {
            SERVICE_UNAVAILABLE: [{service: {name: "Orthopedic"}, startDateTime: 1575561600000},
                {service: {name: "Orthopedic"}, startDateTime: 1576861600000}]
        };

        const {getByText} = renderWithReactIntl(<ConflictsBody conflicts={conflicts} service={service}/>);

        getByText('The Orthopedic service you had selected for the appointment(s) is not available during below ' +
            'listed dates');
        getByText('5th December ‘19 | Thursday | 4:00 PM');
        getByText('20th December ‘19 | Friday | 5:06 PM');
    });

});
