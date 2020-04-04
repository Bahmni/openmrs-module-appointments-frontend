import { fireEvent, render, getByTestId } from "@testing-library/react";
import React from "react";
import { renderWithReactIntl } from "../../utils/TestUtil";
import AppointmentListSidePanelTree from "./AppointmentListSidePanelTree";
import "@testing-library/jest-dom/extend-expect";
import { renderIntoDocument } from "react-dom/test-utils";

describe("AppointmentListSidePanelTree", () => {
  it("should be visible", () => {
    const { getByTestId } = renderWithReactIntl(
      <AppointmentListSidePanelTree />
    );
    expect(getByTestId("tree")).toBeInTheDocument();
  });
});
