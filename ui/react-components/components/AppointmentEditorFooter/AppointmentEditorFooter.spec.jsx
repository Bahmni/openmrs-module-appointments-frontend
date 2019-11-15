import AppointmentEditorFooter from "./AppointmentEditorFooter.jsx";
import React from "react";
import {renderWithReactIntl} from "../../utils/TestUtil";
import {fireEvent} from "@testing-library/react";

describe('Appointment editor Footer Search', () => {
    it('should render Check and Save and Cancel buttons', () => {
        const {container, getByText} = renderWithReactIntl(<AppointmentEditorFooter checkAndSave={() => jest.fn()}/>);
        getByText('Cancel');
        getByText('Check and Save');
        expect(container.querySelectorAll('.button').length).toBe(2);
    });

    it('should render Update and Cancel buttons', () => {
        const {container, getByText} = renderWithReactIntl(<AppointmentEditorFooter isEdit={true}/>);
        getByText('Cancel');
        getByText('Update');
        expect(container.querySelectorAll('.button').length).toBe(2);
    });

    it('should render update options on click of update button', () => {
        const {container, getByText} = renderWithReactIntl(<AppointmentEditorFooter isEdit={true} showUpdateOptions={true}/>);

        const update = getByText('Update');
        fireEvent.click(update);
        expect(container.hasChildNodes()).toBeTruthy();
        expect(container.querySelector('.updateOptions')).not.toBeNull();
    });

    it('should not render update options and checkAndSave should be called on click of update button', () => {
        const checkAndSaveSpy = jest.fn();
        const {container, getByText} = renderWithReactIntl(<AppointmentEditorFooter isEdit={true} showUpdateOptions={false} checkAndSave={checkAndSaveSpy}/>);
        const update = getByText('Update');
        fireEvent.click(update);
        expect(container.querySelector('.updateOptions')).toBeNull();
        expect(checkAndSaveSpy).toHaveBeenCalledTimes(1);
    });
});
