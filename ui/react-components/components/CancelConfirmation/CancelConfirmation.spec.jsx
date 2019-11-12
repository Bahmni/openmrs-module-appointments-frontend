import CancelConfirmation from "../CancelConfirmation/CancelConfirmation";
import React from "react";
import {fireEvent} from '@testing-library/react'
import {renderWithReactIntl} from "../../utils/TestUtil";

describe('CancelConfirmation ', () => {
    it('should render cancel modal closeIcon, title, body, yes and no buttons', () => {
        const {container, getByText} = renderWithReactIntl(<CancelConfirmation close={jest.fn()}/>);
        expect(container.querySelectorAll('.cancelModal').length).toBe(1);
        expect(container.querySelectorAll('.cancelModalCloseIcon').length).toBe(1);
        getByText('Wait!');
        getByText('Are you sure you want to cancel adding the new appointment?This will erase everything you have filled. Nothing will be saved.');
        getByText('Yes');
        getByText('No');
        expect(container.querySelectorAll('.button').length).toBe(2);
    });

    it('should call close method on click of no button', () => {
        const closeSpy = jest.fn();
        const {getByText} = renderWithReactIntl(<CancelConfirmation close={closeSpy}/>);
        fireEvent.click(getByText('No'));
        expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call close method on click of close icon', () => {
        const closeSpy = jest.fn();
        const{container} = renderWithReactIntl(<CancelConfirmation close={closeSpy}/>)
        const closeIcon = container.querySelector('.fa-times');
        fireEvent.click(closeIcon);
        expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onBack function provided from context on click of yes button', () => {
        const closeSpy = jest.fn();
        const onBackSpy = jest.fn();
        const {getByText} = renderWithReactIntl(
            <CancelConfirmation close={closeSpy} onBack={onBackSpy}/>
        );
        fireEvent.click(getByText('Yes'));
        expect(onBackSpy).toHaveBeenCalledTimes(1);
    });
});
