import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Print from './Print'

describe('Print', () => {
    it('render print icon', () => {
        const { asFragment } = render(<Print><div>Sample content</div></Print>)
        expect(asFragment()).toMatchSnapshot()
    })

    it('print method is invoked on iframe on click of icon', () => {
        const {getByTestId} = render(<Print><div>Sample content</div></Print>)
        getByTestId("printFrame").contentWindow.print = jest.fn()
        fireEvent.click(getByTestId("printIcon"))

        expect(getByTestId("printFrame").contentWindow.print).toHaveBeenCalled()
    })
})