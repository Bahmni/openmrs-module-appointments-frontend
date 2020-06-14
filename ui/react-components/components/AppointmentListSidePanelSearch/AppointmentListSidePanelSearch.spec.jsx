import { fireEvent, render, getByTestId } from "@testing-library/react";
import React from "react";
import { renderWithReactIntl } from "../../utils/TestUtil";
import AppointmentListSidePanelSearch from "./AppointmentListSidePanelSearch";
import "@testing-library/jest-dom/extend-expect";
import { renderIntoDocument } from "react-dom/test-utils";

describe("Search Field", () => {
  it("should be visible", () => {
    const { getByPlaceholderText } = renderWithReactIntl(
      <AppointmentListSidePanelSearch />
    );
    expect(getByPlaceholderText("Search..")).toBeInTheDocument();
  });
  it("should render default search icon with search box", () => {
    const { container, getByTestId } = renderWithReactIntl(
      <AppointmentListSidePanelSearch />
    );
    expect(getByTestId("search")).toBeInTheDocument();
  });
  it("user should be able to type", () => {
    const { container, getByText } = renderWithReactIntl(
      <AppointmentListSidePanelSearch />
    );
    const searchBox = container.querySelector(
      ".appointmentListSidePanelSearch"
    );
    fireEvent.change(searchBox, { target: { value: "text" } });
    expect(searchBox.value).toEqual("text");
  });

  it("should render times icon with search box", () => {
    const { container } = renderWithReactIntl(
      <AppointmentListSidePanelSearch />
    );
    const searchBox = container.querySelector(
      ".appointmentListSidePanelSearch"
    );
    fireEvent.change(searchBox, { target: { value: "text" } });
    expect(container.firstChild.classList.contains("fa-times")).not.toBe(null);
  });
});
