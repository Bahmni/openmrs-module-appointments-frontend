import React from "react";
import { render } from "@testing-library/react";
import ColorPicker from "./ColorPicker";
import { getByTestId, queryByTestId } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";

describe("<ColorPicker />", () => {
  it("should render ColorPicker component ", () => {
    const { container } = render(
      <ColorPicker colors={[]} selectedColor={""} onSelect={() => {}} />
    );
    expect(container.querySelector(".colorPickerWrapper")).not.toBeNull();
  });

  it("Should toggle the color picker palette's visibility on click of color picker", () => {
    const colors = ["#DC143C", "#00008B", "#008B8B"];
    const { container } = render(
      <ColorPicker colors={colors} selectedColor={""} onSelect={() => {}} />
    );
    expect(container.querySelector(".colorBox")).toBeNull();
    queryByTestId(container, "picker-button").click();
    expect(container.querySelector(".colorBox")).not.toBeNull();
    queryByTestId(container, "picker-button").click();
    expect(container.querySelector(".colorBox")).toBeNull();
  });

  it("setColor should set the selectedColor field and close the color picker", () => {
    const colors = ["#DC143C", "#00008B", "#008B8B"];
    const { container } = render(
      <ColorPicker colors={colors} selectedColor={""} onSelect={() => {}} />
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
      <ColorPicker
        colors={colors}
        selectedColor={""}
        onSelect={onColorSelect}
      />
    );
    queryByTestId(container, "picker-button").click();
    queryByTestId(container, "#00008B").click();
    expect(onColorSelect).toHaveBeenCalledTimes(1);
  });
});
