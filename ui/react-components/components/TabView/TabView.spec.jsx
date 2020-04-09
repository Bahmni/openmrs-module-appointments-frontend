import React from "react";
import TabView from "./TabView";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
describe("TabView", () => {
  it("Should render TabView", () => {
    const { getByTestId } = render(
      <Router>
        <TabView routes={[]} />
      </Router>
    );
    expect(getByTestId("tabview")).toBeInTheDocument();
  });
});
