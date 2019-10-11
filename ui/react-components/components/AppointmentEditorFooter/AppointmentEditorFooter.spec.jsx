import AppointmentEditorFooter from "./AppointmentEditorFooter.jsx";
import {renderWithReactIntl} from "../../utils/TestUtil";
import React from "react";

describe('Appointment editor Footer Search', () => {
    it('should render Check and Save and Cancel buttons', () => {
        const {container, getByText} = renderWithReactIntl(<AppointmentEditorFooter/>);
        getByText('Cancel');
        getByText('Check and Save');
        console.log(container.outerHTML);
        expect(container.querySelectorAll('.button').length).toBe(2);
    });
});
