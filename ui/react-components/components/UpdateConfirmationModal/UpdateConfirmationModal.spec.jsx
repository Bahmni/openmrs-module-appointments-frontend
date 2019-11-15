import UpdateConfirmationModal from "../UpdateConfirmationModal/UpdateConfirmationModal";
import React from "react";
import {fireEvent} from '@testing-library/react'
import {renderWithReactIntl} from "../../utils/TestUtil";
import CancelConfirmation from "../CancelConfirmation/CancelConfirmation";

describe('Update Confirmation Modal ', () => {

    it('should render update confirm modal closeIcon, title, body, yes and no buttons', () => {
            const {container, getByText} = renderWithReactIntl(<UpdateConfirmationModal />);
            expect(container.querySelectorAll('.updateConfirmationModal').length).toBe(1);
            expect(container.querySelectorAll('.updateConfirmationModalCloseIcon').length).toBe(1);
            getByText('Kindly Confirm');
            getByText('This will update the new details on the entire scheduled series. This can not be reversed');
            getByText('No, go back');
            getByText('Yes, I confirm');
            expect(container.querySelectorAll('.button').length).toBe(2);
        });

    it('should call close method on click of no button', () => {
        const closeSpy = jest.fn();
        const {getByText} = renderWithReactIntl(<UpdateConfirmationModal close={closeSpy}/>);
        fireEvent.click(getByText('No, go back'));
        expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call close method on click of close icon', () => {
        const closeSpy = jest.fn();
        const{container} = renderWithReactIntl(<UpdateConfirmationModal close={closeSpy}/>)
        const closeIcon = container.querySelector('.fa-times');
        fireEvent.click(closeIcon);
        expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call save function provided from context on click of yes button', () => {
        const saveSpy = jest.fn();
        const {getByText} = renderWithReactIntl(
            <UpdateConfirmationModal save={saveSpy}/>
        );
        fireEvent.click(getByText('Yes, I confirm'));
        expect(saveSpy).toHaveBeenCalledTimes(1);
    });

})