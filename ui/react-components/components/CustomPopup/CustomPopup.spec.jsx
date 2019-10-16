import CustomPopup from "./CustomPopup";
import React from 'react';
import {render, fireEvent} from '@testing-library/react'
import {TestUtil} from "./TestUtil.jsx";

describe('Custom popup', () => {
    it('should display the given text provided in popup content on click of trigger component', () => {
        const triggerComponent = <button>Button</button>;
        const {getByText} = render(<CustomPopup triggerComponent={triggerComponent}
                                                           popupContent={React.cloneElement(<TestUtil/>, {close: jest.fn()})}/>);
        fireEvent.click(getByText('Button'));
        getByText('Text');
    });
});
