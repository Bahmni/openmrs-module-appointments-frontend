import {renderWithReactIntl} from "../../utils/TestUtil";
import React from "react";
import UpdateSuccessModal from "./UpdateSuccessModal.jsx";
import {AppContext} from "../AppContext/AppContext";
import {fireEvent} from "@testing-library/react";

describe('Update Success Modal', () => {

    it('should render success modal closeIcon, text, close button', () => {
        const {container, getByText} = renderWithReactIntl(<UpdateSuccessModal />);
        expect(container.querySelectorAll('.saveModal').length).toBe(1);
        expect(container.querySelectorAll('.saveModalCloseIcon').length).toBe(1);
        getByText('Update Successful!');
        getByText('Details are successfully updated for the selected appointment.');
        getByText('Close');
        expect(container.querySelectorAll('.button').length).toBe(1);
    });

    it('should call onBack function provided from context on click of close button', () => {
        const onBackSpy = jest.fn();
        const {getByText} = renderWithReactIntl(
            <AppContext.Provider value={{onBack: onBackSpy}}>
                <UpdateSuccessModal />
            </AppContext.Provider>
        );
        fireEvent.click(getByText('Close'));
        expect(onBackSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onBack function provided from context on click of close icon', () => {
        const onBackSpy = jest.fn();
        const {container, getByText} = renderWithReactIntl(
            <AppContext.Provider value={{onBack: onBackSpy}}>
                <UpdateSuccessModal />
            </AppContext.Provider>);
        const closeIcon = container.querySelector('.fa-times');
        fireEvent.click(closeIcon);
        expect(onBackSpy).toHaveBeenCalledTimes(1);
    });

});
