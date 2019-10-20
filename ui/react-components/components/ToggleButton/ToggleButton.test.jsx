import React from "react";
import ToggleButton from './ToggleButton';
import { render } from "@testing-library/react";

describe('ToggleButton', () => {
    it('should render toggle button', () => {
        const {container} = render(<ToggleButton/>);
        const toggleBtnElement = container.querySelector('.toggle-btn-checkbox');
        expect(toggleBtnElement).not.toBeNull();
        expect(toggleBtnElement.disabled).toBeFalsy();
    });

    it('should render disabled toggle button', () => {
        const {container} = render(<ToggleButton disabled/>);
        const toggleBtnElement = container.querySelector('.toggle-btn-checkbox');
        expect(toggleBtnElement.disabled).toBeTruthy();
    });
});

