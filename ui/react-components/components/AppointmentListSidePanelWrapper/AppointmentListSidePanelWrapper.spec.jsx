import { fireEvent, render, getByTestId } from "@testing-library/react";
import React from "react";
import { renderWithReactIntl } from "../../utils/TestUtil";
import AppointmentListSidePanelWrapper from "./AppointmentListSidePanelWrapper";
import "@testing-library/jest-dom/extend-expect";
import { renderIntoDocument } from "react-dom/test-utils";
import AppointmentListSidePanelSearch from "../AppointmentListSidePanelSearch/AppointmentListSidePanelSearch";
import AppointmentListSidePanelTree from "../AppointmentListSidePanelTree/AppointmentListSidePanelTree";
import Label from "../Label/Label";
import ToggleButton from "../ToggleButton/ToggleButton";

describe("AppointmentListSidePanelWrapper", () => {
  it("wrapper should be visible", () => {
    const { container } = renderWithReactIntl(
      <AppointmentListSidePanelWrapper />
    );
    const elementWrapper = container.querySelector(
      ".AppointmentListSidePanelContainer"
    );
    expect(elementWrapper).not.toBeNull();
  });
  it("AppointmentListSidePanelSearch be visible", () => {
    const { getByPlaceholderText } = renderWithReactIntl(
      <AppointmentListSidePanelSearch />
    );
    expect(getByPlaceholderText("Search..")).toBeInTheDocument();
  });
  it("should be visible", () => {
    const { getByTestId } = renderWithReactIntl(
      <AppointmentListSidePanelTree />
    );
    expect(getByTestId("tree")).toBeInTheDocument();
  });
  it('should render the label', () => {
    const {getByText} = renderWithReactIntl(<Label translationKey="SHOW_SELECTED_LABEL" defaultValue="Show selected"/>);
    getByText('Show selected');
});
it('should render toggle button', () => {
  const {container} = render(<ToggleButton/>);
  const toggleBtnElement = container.querySelector('.toggle-btn-checkbox');
  expect(toggleBtnElement).not.toBeNull();
  expect(toggleBtnElement.disabled).toBeFalsy();
});
  it("AppointmentListSidePanelTree should be visible", () => {});
});
