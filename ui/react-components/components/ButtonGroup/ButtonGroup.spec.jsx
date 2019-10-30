import {renderWithReactIntl} from "../../utils/TestUtil";
import ButtonGroup from "./ButtonGroup.jsx";
import React from "react";

describe('Button Group', () => {
    it('should display the given content in buttons', () => {
        const buttonsList = [
            {
                translationKey: 'ONE',
                defaultValue: 'One'
            },
            {
                translationKey: 'TWO',
                defaultValue: 'Two'
            },
            {
                translationKey: 'THREE',
                defaultValue: 'Three'
            }
        ];
        const {getByText} = renderWithReactIntl(<ButtonGroup buttonsList={buttonsList}/>);
        getByText('One');
        getByText('Two');
        getByText('Three');
    })
});
