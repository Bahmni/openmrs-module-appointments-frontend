import {
  fireEvent,
  render,
  getByTestId,
  getByPlaceholderText
} from "@testing-library/react";
import React from "react";
import { renderWithReactIntl } from "../../utils/TestUtil";
import AppointmentListSidePanelWrapper from "./AppointmentListSidePanelWrapper";
import "@testing-library/jest-dom/extend-expect";
import { renderIntoDocument } from "react-dom/test-utils";
import AppointmentListSidePanelSearch from "../AppointmentListSidePanelSearch/AppointmentListSidePanelSearch";
import AppSpecialityFilter from "../AppSpecialityFilter/AppSpecialityFilter";
import Label from "../Label/Label";
import ToggleButton from "../ToggleButton/ToggleButton";

describe("AppointmentListSidePanelWrapper", () => {
  it("Wrapper should be visible", () => {
    const { container } = renderWithReactIntl(
      <AppointmentListSidePanelWrapper />
    );
    const elementWrapper = container.querySelector(
      ".AppointmentListSidePanelContainer"
    );
    expect(elementWrapper).not.toBeNull();
  });
  it("AppointmentListSidePanelSearch should be visible", () => {
    const { getByPlaceholderText } = renderWithReactIntl(
      <AppointmentListSidePanelSearch />
    );
    expect(getByPlaceholderText("Search..")).toBeInTheDocument();
  });
  it("AppSpecialityFilter should be visible", () => {
    const { getByTestId } = renderWithReactIntl(
      <AppSpecialityFilter />
    );
    expect(getByTestId("tree")).toBeInTheDocument();
  });
  it("Label should be visible", () => {
    const { getByText } = renderWithReactIntl(
      <Label
        translationKey="SHOW_SELECTED_LABEL"
        defaultValue="Show selected"
      />
    );
    getByText("Show selected");
  });
  it("Toggle should be visible", () => {
    const { container } = render(<ToggleButton />);
    const toggleBtnElement = container.querySelector(".toggleBtnCheckbox");
    expect(toggleBtnElement).not.toBeNull();
    expect(toggleBtnElement.disabled).toBeFalsy();
  });
});

describe("ToggleButton", () => {
  it("search box should be disabled on toggle switch on", () => {
    const { getByTestId } = renderWithReactIntl(
      <AppointmentListSidePanelSearch disabledInputSearch={true} />
    );
    expect(getByTestId("appointmentSearch")).toBeDisabled();
  });
  it("on toggle button toggleHandler should be called", () => {
    const mockFn = jest.fn();
    const { container } = renderWithReactIntl(
      <ToggleButton handleToggle={mockFn} />
    );
    const toggleButton = container.querySelector(".toggleBtnCheckbox");
    fireEvent.click(toggleButton);
    expect(mockFn).toHaveBeenCalled();
  });
});
describe("AppSpecialityFilter", () => {
  it("on node click getCheckedNodeHandler should be called", () => {
    const mockFn = jest.fn();
    const nodes = [
      {
        label: "Physiotherapy OPD",
        value: "2b87edcf-39ac-4dec-94c9-713b932e847c",
        appointmentServiceId: 1,
        name: "Physiotherapy OPD",
        children: [
          {
            label: "1 session [30 min]",
            value: "50ac6a9c-158a-4743-a6b5-a4f9c9317007",
            duration: 30,
            name: "1 session",
            uuid: "50ac6a9c-158a-4743-a6b5-a4f9c9317007"
          }
        ]
      }
    ];
    const { container, getByTestId, getByText } = renderWithReactIntl(
      <AppSpecialityFilter getChecked={mockFn} nodes={nodes} />
    );

    const treeElem = container.querySelector(".rct-title");
    fireEvent.click(treeElem);
    expect(mockFn).toHaveBeenCalled();
  });
});

describe("AppointmentListSidePanelSearch", () => {
  it("on search searchHandler should be called", () => {
    const mockFn = jest.fn();
    const { container } = renderWithReactIntl(
      <AppointmentListSidePanelSearch onChange={mockFn} />
    );
    const search = container.querySelector(".appointmentListSidePanelSearch");
    fireEvent.change(search, { target: { value: "text" } });
    expect(mockFn).toHaveBeenCalled();
  });
  it("on clear search clearSearchTextHandler should be called", () => {
    const mockFn = jest.fn();
    const { container } = renderWithReactIntl(
      <AppointmentListSidePanelSearch onClearText={mockFn} />
    );
    const searchBox = container.querySelector(
      ".appointmentListSidePanelSearch"
    );
    fireEvent.change(searchBox, { target: { value: "text" } });
    const icon = container.querySelector(".icon");
    fireEvent.click(icon);
    expect(mockFn).toHaveBeenCalled();
  });
});
