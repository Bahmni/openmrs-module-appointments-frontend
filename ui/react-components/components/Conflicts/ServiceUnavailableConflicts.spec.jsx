import {renderWithReactIntl} from "../../utils/TestUtil";
import React from "react";
import ServiceUnavailableConflicts from "./ServiceUnavailableConflicts";

describe('ServiceUnavailableConflicts', () => {
    it('should render service conflicts content', () => {
        const service = {label: 'Orthopedic'};
        const conflicts = {
            SERVICE_UNAVAILABLE: [{service: {name: "Orthopedic"}, startDateTime: 1575561600000},
                {service: {name: "Orthopedic"}, startDateTime: 1576861600000}]
        };

        const {getByText} = renderWithReactIntl(<ServiceUnavailableConflicts
            conflicts={conflicts.SERVICE_UNAVAILABLE} service={service}/>);

        getByText('The Orthopedic service you had selected for the appointment(s) is not available during below ' +
            'listed dates');
        getByText('5th December ‘19 | Thursday | 4:00 PM');
        getByText('20th December ‘19 | Friday | 5:06 PM');
    });
});
