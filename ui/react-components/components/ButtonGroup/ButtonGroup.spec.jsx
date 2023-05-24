import {renderWithReactIntl} from "../../utils/TestUtil";
import ButtonGroup from "./ButtonGroup.jsx";
import React from "react";
import {fireEvent} from "@testing-library/react";

describe('Button Group', () => {
    it('should display the given content in buttons', () => {
        const buttonsList = new Map([
            ['ONE', {
                translationKey: 'ONE',
                defaultValue: 'One'
            }],
            ['TWO', {
                translationKey: 'TWO',
                defaultValue: 'Two'
            }],
            ['THREE', {
                translationKey: 'THREE',
                defaultValue: 'Three'
            }]
        ]);
        const {getByText} = renderWithReactIntl(<ButtonGroup buttonsList={buttonsList} onClick={jest.fn()}
                                                             enable={false}/>);
        getByText('One');
        getByText('Two');
        getByText('Three');
    });

    it('should get selected className for selected buttons', () => {
        const buttonsList = new Map([
            ['ONE', {
                translationKey: 'ONE',
                defaultValue: 'One',
                isSelected: true
            }],
            ['TWO', {
                translationKey: 'TWO',
                defaultValue: 'Two',
                isSelected: true
            }],
            ['THREE', {
                translationKey: 'THREE',
                defaultValue: 'Three',
                isSelected: false
            }]
        ]);

        const {container} = renderWithReactIntl(<ButtonGroup buttonsList={buttonsList} onClick={jest.fn()}
                                                             enable={false}/>);
        expect(container.querySelectorAll('.selected').length).toBe(2);
    });

    it('should call onClick when button is clicked', () => {
        const buttonsList = new Map([
            ['ONE', {
                translationKey: 'ONE',
                defaultValue: 'One',
                isSelected: true
            }],
            ['TWO', {
                translationKey: 'TWO',
                defaultValue: 'Two',
                isSelected: true
            }]
        ]);

        let onClickSpy = jest.fn();
        const {getByText} = renderWithReactIntl(<ButtonGroup buttonsList={buttonsList} onClick={onClickSpy}
                                                             enable={true}/>);
        fireEvent.click(getByText('One'));
        fireEvent.click(getByText('Two'));
        expect(onClickSpy).toHaveBeenCalledTimes(2);
    });

});
