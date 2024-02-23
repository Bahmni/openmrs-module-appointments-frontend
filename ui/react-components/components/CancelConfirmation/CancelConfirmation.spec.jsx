import CancelConfirmation from "../CancelConfirmation/CancelConfirmation";
import React from "react";
import {fireEvent} from '@testing-library/react'
import {renderWithReactIntl} from "../../utils/TestUtil";
import {Button} from "carbon-components-react";

describe('CancelConfirmation ', () => {
    const cancelButton = <Button>Cancel Trigger</Button>
    it('should render cancel modal closeIcon, title, body, yes and no buttons', async() => {
        const { getByText} = renderWithReactIntl(<CancelConfirmation triggerComponent={cancelButton} onBack={jest.fn()}/>);
        getByText('Discard appointment?');
        getByText('You will lose appointment details. Do you want to discard these changes?');
        getByText('Cancel');
        getByText('Discard');
    });

    it('should close the modal on click of Cancel button without calling onBack', () => {
        const onBackSpy = jest.fn();
        const { getByText} = renderWithReactIntl(<CancelConfirmation triggerComponent={cancelButton} onBack={onBackSpy}/>);
        fireEvent.click(getByText('Cancel'));
        expect(onBackSpy).toHaveBeenCalledTimes(0);
    });

    it('should call onBack function provided from context on click of yes button', () => {
        const onBackSpy = jest.fn();
        const {getByText} = renderWithReactIntl(<CancelConfirmation triggerComponent={cancelButton} onBack={onBackSpy}/>);
        fireEvent.click(getByText('Discard'));
        expect(onBackSpy).toHaveBeenCalledTimes(1);
    });
});
