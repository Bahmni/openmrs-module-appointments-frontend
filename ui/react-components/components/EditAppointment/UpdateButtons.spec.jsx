import React from "react";
import {renderWithReactIntl} from "../../utils/TestUtil";
import {fireEvent} from "@testing-library/react";
import AppointmentEditorFooter from "../AppointmentEditorFooter/AppointmentEditorFooter";
import UpdateButtons from "./UpdateButtons";

describe('Update Buttons', () => {
    it('should call checkAndSave method by passing false on click of Update one Appointment button', () => {
        const checkAndSaveSpy = jest.fn();
        const updateOptionsVisibleStatusSpy = jest.fn();
        const {getByText} = renderWithReactIntl(<UpdateButtons checkAndSave={checkAndSaveSpy}
                                                               updateOptionsVisibleStatus={updateOptionsVisibleStatusSpy}/>);
        const update = getByText('Update this occurrence');
        fireEvent.click(update);
        expect(checkAndSaveSpy).toHaveBeenCalledWith(false);
    });

    it('should call checkAndSave method by passing true on click of Update all Appointments button', () => {
        const checkAndSaveSpy = jest.fn();
        const updateOptionsVisibleStatusSpy = jest.fn();
        const {getByText} = renderWithReactIntl(<UpdateButtons checkAndSave={checkAndSaveSpy}
                                                               updateOptionsVisibleStatus={updateOptionsVisibleStatusSpy}/>);
        const update = getByText('Update all occurrences');
        fireEvent.click(update);
        expect(checkAndSaveSpy).toHaveBeenCalledWith(true);
    });

});
