import React from "react";
import AppointmentTimePicker from "./TimePicker.jsx";
import {renderWithReactIntl} from "../../utils/TestUtil";
import {fireEvent} from "@testing-library/react";

const Wrapper = (props) => {
  return  <div>
        {props.children}
    </div>
}

describe('TimePicker', () => {

    it('should render Time picker component', function () {
        const placeHolderKey = "CHOOSE_TIME_PLACE_HOLDER";
        const defaultValue = "Click to select time";
        let onChangeSpy = jest.fn();
        const {container} = renderWithReactIntl(<AppointmentTimePicker onChange={onChangeSpy}
                                                                       placeHolderTranslationKey={placeHolderKey}
                                                                       placeHolderDefaultMessage={defaultValue}/>);
        expect(container.querySelector('.appointmentTimePicker')).not.toBeNull();
    });

    it('should display default value for placeholder', async () => {
        const placeHolderKey = "CHOOSE_TIME_PLACE_HOLDER";
        const defaultValue = "Click to select time";
        const onChangeSpy = jest.fn();
        const {container} = renderWithReactIntl(<AppointmentTimePicker onChange={onChangeSpy}
                                                                       placeHolderTranslationKey={placeHolderKey}
                                                                       placeHolderDefaultMessage={defaultValue}/>);
        const inputBox = container.querySelector('.rc-time-picker-input');
        expect(inputBox.placeholder).toBe("Click to select time");
    });

    it('should contains the typed value', async () => {
        const placeHolderKey = "CHOOSE_TIME_PLACE_HOLDER";
        const defaultValue = "Click to select time";
        let onChangeSpy = jest.fn();
        const {container} = renderWithReactIntl(<AppointmentTimePicker onChange={onChangeSpy}
                                                                       placeHolderTranslationKey={placeHolderKey}
                                                                       placeHolderDefaultMessage={defaultValue}/>);
        const inputBox = container.querySelector('.rc-time-picker-input');
        fireEvent.focusIn(inputBox, {target: {value: "7:10 am"}});

        expect(inputBox.value).toBe("7:10 am");
    });

    it('should call onchange when time entered', async () => {
        const placeHolderKey = "CHOOSE_TIME_PLACE_HOLDER";
        const defaultValue = "Click to select time";
        let onChangeSpy = jest.fn();
        const {container, baseElement} = renderWithReactIntl(<Wrapper><AppointmentTimePicker onChange={onChangeSpy}
                                                                                                      placeHolderTranslationKey={placeHolderKey}

                                                                                                      placeHolderDefaultMessage={defaultValue}/></Wrapper>);
        const inputBox = container.querySelector('.rc-time-picker-input');
        fireEvent.click(inputBox)
        const entryBox = baseElement.querySelector('.rc-time-picker-panel-input');
        fireEvent.change(entryBox, { target: { value: "7:10 am" } })
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(entryBox.value).toBe("7:10 am");
    });
});
