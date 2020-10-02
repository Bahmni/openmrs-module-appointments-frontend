import React from "react";
import moment from 'moment';
import {fireEvent} from '@testing-library/react';
import {renderWithReactIntl} from '../../utils/TestUtil';
import '@testing-library/jest-dom/extend-expect';
import GridSummary from "./GridSummary";
import data from './AppointSummary.json'

describe("Grid Summary",()=>{
    it("should render table for grid summary",()=>{
        const {container} = renderWithReactIntl(<GridSummary gridData={data}/>);
        expect(container.querySelector('.tableGridSummary')).toBeInTheDocument()

    });

    it("should contain service label in table for grid summary",()=>{
        const {getByText} = renderWithReactIntl(<GridSummary gridData={data}/>);
        expect(getByText('Total')).toBeInTheDocument()

    });

    it('onClick function should get called on count click',()=>{
        const clickHandler=jest.fn()
        const {container} = renderWithReactIntl(<GridSummary gridData={data} onClick={clickHandler}/>);
        const count=container.querySelector('a')
        fireEvent.click(count)
        expect(clickHandler).toHaveBeenCalledTimes(1)
    })

    it('Should not render data-rows, when data is empty',()=>{
        const {queryByTestId} = renderWithReactIntl(<GridSummary gridData={[]}/>);
        expect(queryByTestId('row')).toBeNull()
    })
})
