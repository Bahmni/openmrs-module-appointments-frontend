import React from "react";
import ToggleButton from "./ToggleButton";
import { render, fireEvent } from "@testing-library/react";

describe("ToggleButton", () => {
    it("should render toggle button", () => {
        const { container } = render(<ToggleButton />);
        const toggleBtnElement = container.querySelector(".toggleBtnCheckbox");
        expect(toggleBtnElement).not.toBeNull();
        expect(toggleBtnElement.disabled).toBeFalsy();
    });

    it("should render disabled toggle button", () => {
        const { container } = render(<ToggleButton disabled />);
        const toggleBtnElement = container.querySelector(".toggleBtnCheckbox");
        expect(toggleBtnElement.disabled).toBeTruthy();
    });

    it("should render checked toggle button", () => {
        const { container } = render(
            <ToggleButton handleToggle={jest.fn()} checked />
        );
        const toggleBtnElement = container.querySelector(".toggleBtnCheckbox");
        expect(toggleBtnElement.checked).toBeTruthy();
    });

    it("should call fn passed on toggle", () => {
        const handleToggleSpy = jest.fn();
        const { container } = render(
            <ToggleButton handleToggle={handleToggleSpy} />
        );
        const toggleBtnElement = container.querySelector(".toggleBtnCheckbox");
        fireEvent.click(toggleBtnElement, {});
        expect(handleToggleSpy).toHaveBeenCalledTimes(1);
    });
});
