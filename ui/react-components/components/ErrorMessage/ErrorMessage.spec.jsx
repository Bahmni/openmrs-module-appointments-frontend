import '@testing-library/jest-dom/extend-expect';
import {render} from "@testing-library/react";
import ErrorMessage from "./ErrorMessage.jsx";
import React from "react";

jest.mock('../../utils/CookieUtil');

describe('ErrorMessage', () => {

    it('should render the component without prop', () => {
        const {container} = render(<ErrorMessage/>);
        expect(container.querySelector('.messageHolder')).not.toBeNull();
    });

    it('should render the component even when message is null', () => {
        const {container} = render(<ErrorMessage message={null}/>);
        expect(container.querySelector('.messageHolder')).not.toBeNull();
    });

    it('should render the component with empty message', () => {
        const {container} = render(<ErrorMessage message=""/>);
        expect(container.querySelector('.messageHolder')).not.toBeNull();
    });

    it('should render the component with given message', () => {
        const {getByText} = render(<ErrorMessage message="Error message"/>);
        getByText("Error message");
    });

});

