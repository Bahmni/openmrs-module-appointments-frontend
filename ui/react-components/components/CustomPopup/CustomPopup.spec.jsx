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

    it('should display content when open is true without ', () => {
        const {getByText} = render(<CustomPopup popupContent={React.cloneElement(<TestUtil/>, {close: jest.fn()})}
                                                open={true}/>);
        getByText('Text');
    });

    it('should not display content when open is false', () => {
        const {queryByText} = render(<CustomPopup popupContent={React.cloneElement(<TestUtil/>, {close: jest.fn()})}
                                                  open={false}/>);
        expect(queryByText('Text')).toBeNull();
    });
});
