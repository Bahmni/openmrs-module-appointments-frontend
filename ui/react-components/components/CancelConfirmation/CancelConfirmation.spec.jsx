import CancelConfirmation from "../CancelConfirmation/CancelConfirmation";
import React from "react";
import {renderWithReactIntl} from "../../utils/TestUtil";

describe('CancelConfirmation ', () => {
    it('should render cancel modal closeIcon, title, body, yes and no buttons', () => {
        const {container, getByText} = renderWithReactIntl(<CancelConfirmation close={() => jest.fn()}/>);
        expect(container.querySelectorAll('.cancelModal').length).toBe(1);
        expect(container.querySelectorAll('.cancelModalCloseIcon').length).toBe(1);
        getByText('Wait!');
        getByText('Are you sure you want to cancel adding the new appointment?This will erase everything you have filled. Nothing will be saved.');
        getByText('Yes');
        getByText('No');
        expect(container.querySelectorAll('.button').length).toBe(2);
    });
});
