import '@testing-library/jest-dom/extend-expect';
import {fireEvent, waitForElement} from "@testing-library/react";
import React from "react";
import {renderWithReactIntl} from '../../utils/TestUtil';
import FilterWrapper from './FilterWrapper';

describe('Filter Wrapper for Search Fields',()=>{

    it('Privder Search rendered ',()=>{
        const {getByText} = renderWithReactIntl(<FilterWrapper/>)

        expect(getByText('Provider')).toBeInTheDocument()
        expect(getByText('Choose Provider')).toBeInTheDocument()
        
    })

    it('Location Search rendered ',()=>{
        const {getByLabelText,getAllByText} = renderWithReactIntl(<FilterWrapper/>)

        expect(getAllByText('Location').length).toEqual(2)
    })
    it('Appoitment Status Search rendered ',()=>{
        const {getByText} = renderWithReactIntl(<FilterWrapper/>)

        expect(getByText('Appointment Status')).toBeInTheDocument()
        expect(getByText('Enter Status Name')).toBeInTheDocument()
        
    })
})
