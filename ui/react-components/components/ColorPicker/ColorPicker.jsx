import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import {
  colorPickerWrapper,
  colorBoxTrigger,
  selectedColorBox,
  colorBox,
  colorTile
} from "./ColorPicker.module.scss";
import PropTypes from "prop-types";

function ColorPicker(props) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(props.selectedColor || "");
  const ref = useRef(null);

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowColorPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const toggleColorPicker = () => setShowColorPicker(!showColorPicker);

  const setColor = color => {
    setSelectedColor(color);
    setShowColorPicker(false);
    props.onSelect(color);
  };

  return (
    <div ref={ref} className={classNames(colorPickerWrapper)}>
      <div className={classNames(colorBoxTrigger)} onClick={toggleColorPicker}>
        <span
          className={classNames(selectedColorBox)}
          data-testid="selected-color"
          style={{
            backgroundColor: selectedColor,
            borderColor: selectedColor
          }}
        ></span>
        <i
          className={classNames("fa", "fa-caret-down")}
          aria-hidden="true"
          data-testid="picker-button"
        ></i>
      </div>

      {showColorPicker ? (
        <div
          className={
            props.colors.length > 0 ? classNames(colorBox) : classNames("")
          }
        >
          {props.colors.map(color => (
            <div
              className={classNames(colorTile)}
              data-testid={color}
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => setColor(color)}
            ></div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ColorPicker;

ColorPicker.propTypes = {
  colors: PropTypes.array.isRequired,
  selectedColor: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};
