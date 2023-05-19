import React from "react";
import ConflictsFooter from "./ConflictsFooter";
import {fireEvent} from '@testing-library/react';
import {renderWithReactIntl} from "../../../utils/TestUtil";

describe('ConflictsFooter', () => {

    const messages = {
        APPOINTMENT_SAVE_ANYWAY: 'Yes save anyway',
        APPOINTMENT_MODIFY_INFORMATION: 'No modify information'
    }

    it('should have Save-Anyway button', () => {
        const {container, getByText} = renderWithReactIntl(<ConflictsFooter/>, messages);

        expect(container.querySelector('.bx--btn--secondary')).not.toBeNull();
        expect(getByText('Yes save anyway')).not.toBeNull();
    });

    it('should call saveAnyway function on button click', () => {
        const saveAnywaySpy = jest.fn();
        const {getByText} = renderWithReactIntl(<ConflictsFooter saveAnyway={saveAnywaySpy}/>, messages);
        const saveAnywayButton = getByText('Yes save anyway');

        fireEvent.click(saveAnywayButton);

        expect(saveAnywaySpy).toHaveBeenCalled();
    });

    it('should call modifyInformation function on modify information button click', () => {
        const modifyInformationSpy = jest.fn();
        const {getByText} = renderWithReactIntl(<ConflictsFooter modifyInformation={modifyInformationSpy}/>, messages);
        const modifyInformationButton = getByText('No modify information');

        fireEvent.click(modifyInformationButton);

        expect(modifyInformationSpy).toHaveBeenCalled();
    });

    it('should disable Save Anyway button on click of the button', () => {
        const saveAnywaySpy = jest.fn();
        const {getByText, getByTestId} = renderWithReactIntl(<ConflictsFooter saveAnyway={saveAnywaySpy} disableSaveAnywayButton={true} />);
        const saveAnywayButton = getByTestId('conflictsSaveAnyway');
        fireEvent.click(saveAnywayButton);
        expect(saveAnywayButton.disabled).toBe(true);
    });
});
