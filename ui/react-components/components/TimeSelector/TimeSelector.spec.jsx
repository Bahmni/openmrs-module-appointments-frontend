import {renderWithReactIntl} from "../../utils/TestUtil";
import TimeSelector from "./TimeSelector.jsx";
import React from "react";

describe('Time Selector', () => {
    it('should display a label and time picker when time selector is rendered', () => {
        let timeSelectionDefaultValue = 'time select default value';
        let defaultValue = 'default value';
        const props = {
            onChange: jest.fun,
            translationKey: 'translation key',
            defaultValue: defaultValue,
            timeSelectionTranslationKey: 'time select translation key',
            timeSelectionDefaultValue: timeSelectionDefaultValue};
        const {getByText, getByPlaceholderText} = renderWithReactIntl(<TimeSelector {...props} onChange={jest.fn()}/>);
        getByText(defaultValue);
        getByPlaceholderText(timeSelectionDefaultValue);
    });
});
