import CustomPopup from "./CustomPopup";
import React from 'react';
import {render, fireEvent} from '@testing-library/react'


describe('Custom popup', () => {
    it('should display the given text provided in popup content on click of trigger component', () => {
        const triggerComponent = <button>Button</button>;
        const {getByText} = render(<CustomPopup triggerComponent={triggerComponent} popupContent={<div>Text</div>}/>);
        fireEvent.click(getByText('Button'));
        getByText('Text');
    });
});
