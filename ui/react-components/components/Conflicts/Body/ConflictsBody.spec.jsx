import React from "react";
import ConflictsBody from "./ConflictsBody";
import {renderWithReactIntl} from "../../../utils/TestUtil";


describe('Conflicts Body', () => {

    const messages = {'OVERLAPPING_CONFLICTS': 'Patient double booking',
        'NO_SERVICE_DATE_CONFLICTS':'Service unavailability'};
    it('should render patient double booking and service unavailable tabs', function () {
        const conflicts = {SERVICE_UNAVAILABLE: [{uuid: "uuid"}], PATIENT_DOUBLE_BOOKING: [{uuid: "uuid"}]};

        const {getByText} = renderWithReactIntl(<ConflictsBody conflicts={conflicts}/>, messages);

        expect(getByText("Patient double booking")).not.toBeNull();
        expect(getByText("Service unavailability")).not.toBeNull();
    });

    it('should render patient double booking tab', function () {
        const conflicts = {PATIENT_DOUBLE_BOOKING: [{uuid: "uuid"}]};

        const {getByText} = renderWithReactIntl(<ConflictsBody conflicts={conflicts}/>, messages);

        expect(getByText("Patient double booking")).not.toBeNull();
    });

    it('should not render any tabs if conflicts don\'t exist', function () {
        const conflicts = {};

        const {queryByText} = renderWithReactIntl(<ConflictsBody conflicts={conflicts}/>, messages);

        expect(queryByText('Overlapping conflicts')).toBeNull();
        expect(queryByText('No-Service Date conflicts')).toBeNull();
    });

});
