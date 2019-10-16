import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ColorPicker from "./ColorPicker";
import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  wait
} from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import ReactTestUtils from "react-dom/test-utils";

describe("<ColorPicker />", () => {
  it("should render ColorPicker component ", () => {
    const { container } = render(<ColorPicker />);
    expect(container.querySelector(".colorPickerWrapper")).not.toBeNull();
  });

  it("Should toggle the display of color picker on click the picker", () => {
    const colors = ["#DC143C", "#00008B", "#008B8B"];
    const { container } = render(<ColorPicker colors={colors} />);
    expect(container.querySelector(".colorBox")).toBeNull();
    queryByTestId(container, "picker-button").click();
    expect(container.querySelector(".colorBox")).not.toBeNull();
    queryByTestId(container, "picker-button").click();
    expect(container.querySelector(".colorBox")).toBeNull();
  });

  it("setColor should set the selectedColor field and close the color picker", () => {
    const colors = ["#DC143C", "#00008B", "#008B8B"];
    const { container } = render(
      <ColorPicker colors={colors} onSelect={() => {}} />
    );
    queryByTestId(container, "picker-button").click();
    queryByTestId(container, "#00008B").click();
    expect(container.querySelector(".colorBox")).toBeNull();
    expect(getByTestId(container, "selected-color")).toHaveStyle(
      "backgroundColor: '#00008B' borderColor: '#00008B'"
    );
  });

  it("setColor should call the onColorSelect callback", () => {
    const colors = ["#DC143C", "#00008B", "#008B8B"];
    const onColorSelect = jest.fn();
    const { container } = render(
      <ColorPicker colors={colors} onSelect={onColorSelect} />
    );
    queryByTestId(container, "picker-button").click();
    queryByTestId(container, "#00008B").click();
    expect(onColorSelect).toHaveBeenCalledTimes(1);
  });
});
