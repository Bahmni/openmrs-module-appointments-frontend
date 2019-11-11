import React from "react";
import PatientDoubleBookingConflicts from "./PatientDoubleBookingConflicts";
import {renderWithReactIntl} from "../../utils/TestUtil";

describe('PatientDoubleBookingConflicts', () => {

    it('should render patient double booking conflicts content', () => {
        const service = {name: 'Orthopedic'};
        const conflicts = {PATIENT_DOUBLE_BOOKING: [{service: {name: "Dressing"}, startDateTime: 1575561600000}]};
        const {container, getByText} = renderWithReactIntl(<PatientDoubleBookingConflicts
            conflicts={conflicts.PATIENT_DOUBLE_BOOKING} service={service}/>);

        getByText('The recurring appointments you are trying to book overlaps with the following dates');
        getByText('5th December ‘19 | Thursday | 4:00 PM');
        expect(container.querySelector('.conflictMessage').innerHTML).toContain('Current Orthopedic request');
        expect(container.querySelector('.boldContent').innerHTML).toContain('conflicts with Dressing');
    });
});
