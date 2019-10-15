import React from "react";
import AppointmentTimePicker from "./TimePicker.jsx";
import {renderWithReactIntl} from "../../utils/TestUtil";
import {fireEvent} from "@testing-library/react";


describe('TimePicker', () => {

    it('should render Time picker component', function () {
        const placeHolderKey = "CHOOSE_TIME_PLACE_HOLDER";
        const defaultValue = "Click to select time";
        let onChangeSpy = jest.fn();
        const {container} = renderWithReactIntl(<AppointmentTimePicker onChange={onChangeSpy}
                                                                       placeHolderTranslationKey={placeHolderKey}
                                                                       defaultValue={defaultValue}/>);
        expect(container.querySelector('.appointmentTimePicker')).not.toBeNull();
    });

    it('should display default value for placeholder', async () => {
        const placeHolderKey = "CHOOSE_TIME_PLACE_HOLDER";
        const defaultValue = "Click to select time";
        const onChangeSpy = jest.fn();
        const {container} = renderWithReactIntl(<AppointmentTimePicker onChange={onChangeSpy}
                                                                       placeHolderTranslationKey={placeHolderKey}
                                                                       defaultValue={defaultValue}/>);
        const inputBox = container.querySelector('.rc-time-picker-input');
        expect(inputBox.placeholder).toBe("Click to select time");
    });

    it('should contains the typed value', async () => {
        const placeHolderKey = "CHOOSE_TIME_PLACE_HOLDER";
        const defaultValue = "Click to select time";
        let onChangeSpy = jest.fn();
        const {container} = renderWithReactIntl(<AppointmentTimePicker onChange={onChangeSpy}
                                                                       placeHolderTranslationKey={placeHolderKey}
                                                                       defaultValue={defaultValue}/>);
        const inputBox = container.querySelector('.rc-time-picker-input');
        fireEvent.focusIn(inputBox, {target: {value: "7:10 am"}});

        expect(inputBox.value).toBe("7:10 am");
    });
});
