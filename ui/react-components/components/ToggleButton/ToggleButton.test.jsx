import React from "react";
import { renderWithReactIntl } from "../../utils/TestUtil";
import ToggleButton from './ToggleButton';

describe('ToggleButton', () => {
    it('should render label', () => {
        const label = 'My Label';
        const {getByText, container} = renderWithReactIntl(<ToggleButton label={label}/>);
        getByText(label);
        expect(container.querySelector('input').disabled).toBeFalsy();
    });

    it('should render disabled toggle button', () => {
        const {container} = renderWithReactIntl(<ToggleButton disabled/>);
        expect(container.querySelector('input').disabled).toBeTruthy();
    });
});

