import UpdateConfirmationModal from "../UpdateConfirmationModal/UpdateConfirmationModal";
import React from "react";
import {fireEvent} from '@testing-library/react'
import {renderWithReactIntl} from "../../utils/TestUtil";
import CancelConfirmation from "../CancelConfirmation/CancelConfirmation";

describe('Update Confirmation Modal ', () => {

    it('should render update confirm modal closeIcon, title, body, yes and no buttons', () => {
            const {getByText} = renderWithReactIntl(<UpdateConfirmationModal />);
            getByText('Kindly Confirm');
            getByText('This will update the details of the selected appointment.');
            getByText('No, go back');
            getByText('Yes, I confirm');
        });

    it('should call save function provided from context on click of yes button', () => {
        const saveSpy = jest.fn();
        const {getByText} = renderWithReactIntl(<UpdateConfirmationModal save={saveSpy}/>);
        fireEvent.click(getByText('Yes, I confirm'));
        expect(saveSpy).toHaveBeenCalledTimes(1);
    });

})
