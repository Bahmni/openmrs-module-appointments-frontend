import React from "react";
import ConflictsFooter from "./ConflictsFooter";
import {fireEvent} from '@testing-library/react';
import {renderWithReactIntl} from "../../../utils/TestUtil";

describe('ConflictsFooter', () => {
    it('should have Save-Anyway button', () => {
        const {container, getByText} = renderWithReactIntl(<ConflictsFooter/>);

        expect(container.querySelector('.save')).not.toBeNull();
        expect(getByText('Save Anyway')).not.toBeNull();
    });

    it('should call saveAnyway function on button click', () => {
        const saveAnywaySpy = jest.fn();
        const {getByText} = renderWithReactIntl(<ConflictsFooter saveAnyway={saveAnywaySpy}/>);
        const saveAnywayButton = getByText('Save Anyway');

        fireEvent.click(saveAnywayButton);

        expect(saveAnywaySpy).toHaveBeenCalled();
    });

    it('should call modifyInformation function on modify information button click', () => {
        const modifyInformationSpy = jest.fn();
        const {getByText} = renderWithReactIntl(<ConflictsFooter modifyInformation={modifyInformationSpy}/>);
        const modifyInformationButton = getByText('Modify information');

        fireEvent.click(modifyInformationButton);

        expect(modifyInformationSpy).toHaveBeenCalled();
    });
});
