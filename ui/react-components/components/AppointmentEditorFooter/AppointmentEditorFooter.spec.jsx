import AppointmentEditorFooter from "./AppointmentEditorFooter.jsx";
import React from "react";
import {renderWithReactIntl} from "../../utils/TestUtil";
import {fireEvent} from "@testing-library/react";

describe('Appointment editor Footer Search', () => {

    let cancelConfirmationMessage;

    beforeEach(() => {
       cancelConfirmationMessage = {
           translationKey: 'TRANSLATION_KEY',
           defaultMessage: 'Default Message'
       }
    });

    it('should render Check and Save and Cancel buttons', () => {
        const {container, getByText, getByTestId} = renderWithReactIntl(<AppointmentEditorFooter {...cancelConfirmationMessage} checkAndSave={() => jest.fn()}/>);
        getByTestId('cancel');
        getByText('Check and Save');
    });

    it('should render Update and Cancel buttons', () => {
        const {container, getByText, getByTestId} = renderWithReactIntl(<AppointmentEditorFooter {...cancelConfirmationMessage} isEdit={true}/>);
        getByTestId('cancel');
        getByText('Update');
    });

    it('should render update options on click of update button', () => {
        const {container, getByText, getByTestId} = renderWithReactIntl(<AppointmentEditorFooter {...cancelConfirmationMessage} isEdit={true} isOptionsRequired={true}/>);
        const update = getByText('Update');
        fireEvent.click(update);
        expect(container.hasChildNodes()).toBeTruthy();
        expect(getByTestId("update-buttons")).not.toBeNull();
    });

    it('should not render update options and checkAndSave should be called on click of update button', () => {
        const checkAndSaveSpy = jest.fn();
        const {container, getByText, getByTestId} = renderWithReactIntl(<AppointmentEditorFooter {...cancelConfirmationMessage} isEdit={true} isOptionsRequired={false} checkAndSave={checkAndSaveSpy}/>);
        const update = getByText('Update');
        fireEvent.click(update);
        expect(() => getByTestId("update-buttons")).toThrow();
        expect(checkAndSaveSpy).toHaveBeenCalledTimes(1);
    });

    it('should render update options on click of update button and hide update options on reclick', () => {
        const {container, getByText, getByTestId} = renderWithReactIntl(<AppointmentEditorFooter {...cancelConfirmationMessage} isEdit={true} isOptionsRequired={true}/>);
        const update = getByText('Update');
        fireEvent.click(update);
        fireEvent.click(update);
        expect(container.hasChildNodes()).toBeTruthy();
        expect(() => getByTestId("update-buttons")).toThrow();
    });

    it('should disable update button', () => {
        const {container, getByText, getByTestId} = renderWithReactIntl(<AppointmentEditorFooter {...cancelConfirmationMessage} isEdit={true} disableSaveAndUpdateButton={true} />);
        const update = getByTestId('check-and-save');
        expect(update.disabled).toBe(true);
    });

    it('should not disable update button', () => {
        const {container, getByText, getByTestId} = renderWithReactIntl(<AppointmentEditorFooter {...cancelConfirmationMessage} isEdit={true} disableSaveAndUpdateButton={false} />);
        const update = getByTestId('check-and-save');
        expect(update.disabled).toBe(false);
    });

    it('should disable check and save button on click of the button', () => {
        const {getByTestId} = renderWithReactIntl(<AppointmentEditorFooter {...cancelConfirmationMessage} checkAndSave={() => jest.fn()} disableSaveAndUpdateButton={true} />);
        const checkAndSave = getByTestId('check-and-save');
        fireEvent.click(checkAndSave);
        expect(checkAndSave.disabled).toBe(true);
    });


});
