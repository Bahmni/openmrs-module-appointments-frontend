import React from "react";
import {renderWithReactIntl} from "../../utils/TestUtil";
import {fireEvent} from "@testing-library/react";
import UpdateButtonsModal from "./UpdateButtons";

describe('Update Buttons', () => {
    it('should call checkAndSave method by passing false on click of Update one Appointment button', () => {
        const checkAndSaveSpy = jest.fn();
        const updateOptionsVisibleStatusSpy = jest.fn();
        const {getByText} = renderWithReactIntl(<UpdateButtonsModal checkAndSave={checkAndSaveSpy} show={true}
                                                                    updateOptionsVisibleStatus={updateOptionsVisibleStatusSpy}/>);
        const update = getByText('This occurrence');
        fireEvent.click(update);
        const okButton = getByText("Ok");
        fireEvent.click(okButton);
        expect(checkAndSaveSpy).toHaveBeenCalledWith(false);
    });

    it('should call checkAndSave method by passing true on click of Update all Appointments button', () => {
        const checkAndSaveSpy = jest.fn();
        const updateOptionsVisibleStatusSpy = jest.fn();
        const {getByText} = renderWithReactIntl(<UpdateButtonsModal checkAndSave={checkAndSaveSpy} show={true}
                                                                    updateOptionsVisibleStatus={updateOptionsVisibleStatusSpy}/>);
        const update = getByText('All occurrences');
        fireEvent.click(update);
        const okButton = getByText("Ok");
        fireEvent.click(okButton)
        expect(checkAndSaveSpy).toHaveBeenCalledWith(true);
    });

});
