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
    const translationKey = 'APPOINTMENT_TIME_FROM_LABEL'
    it('should render Time picker component', function () {
        const placeHolderKey = "CHOOSE_TIME_PLACE_HOLDER";
        const defaultValue = "Click to select time";

        let onChangeSpy = jest.fn();
        const {container, getByLabelText} = renderWithReactIntl(<AppointmentTimePicker onChange={onChangeSpy}
                                                                       placeHolderTranslationKey={placeHolderKey}
                                                                       placeHolderDefaultMessage={defaultValue}
                                                                       translationKey={translationKey}/>);
        expect(getByLabelText(translationKey)).not.toBeNull();
    });

    it('should display default value for placeholder', async () => {
        const placeHolderKey = "CHOOSE_TIME_PLACE_HOLDER";
        const defaultValue = "Click to select time";
        const onChangeSpy = jest.fn();
        const {container} = renderWithReactIntl(<AppointmentTimePicker onChange={onChangeSpy}
                                                                       placeHolderTranslationKey={placeHolderKey}
                                                                       placeHolderDefaultMessage={defaultValue}
                                                                       translationKey={translationKey}/>);
        const inputBox = container.querySelector('.bx--time-picker__input-field');
        expect(inputBox.placeholder).toBe("hh:mm");
    });

    it('should contains the typed value', async () => {
        const placeHolderKey = "CHOOSE_TIME_PLACE_HOLDER";
        const defaultValue = "Click to select time";
        let onChangeSpy = jest.fn();
        const {container} = renderWithReactIntl(<AppointmentTimePicker onChange={onChangeSpy}
                                                                       placeHolderTranslationKey={placeHolderKey}
                                                                       placeHolderDefaultMessage={defaultValue}
                                                                       translationKey={translationKey}/>);
        const inputBox = container.querySelector('.bx--time-picker__input-field');
        fireEvent.focusIn(inputBox, {target: {value: "7:10 am"}});

        expect(inputBox.value).toBe("7:10 am");
    });

    it('should call onchange when time entered', async () => {
        const placeHolderKey = "CHOOSE_TIME_PLACE_HOLDER";
        const defaultValue = "Click to select time";
        let onChangeSpy = jest.fn();
        const {container, baseElement} = renderWithReactIntl(<Wrapper><AppointmentTimePicker onChange={onChangeSpy}
                                                                                                      placeHolderTranslationKey={placeHolderKey}
                                                                                                      translationKey={translationKey}
                                                                                                      placeHolderDefaultMessage={defaultValue}/></Wrapper>);
        const inputBox = container.querySelector('.bx--time-picker__input-field');
        fireEvent.click(inputBox)
        const entryBox = baseElement.querySelector('.bx--time-picker__input-field');
        fireEvent.blur(entryBox, { target: { value: "7:10 am" } })
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(entryBox.value).toBe("7:10 am");
    });
});
