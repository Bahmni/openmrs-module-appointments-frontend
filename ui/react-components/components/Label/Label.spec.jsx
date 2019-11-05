import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import Label from './Label.jsx';
import {renderWithReactIntl} from "../../utils/TestUtil";

describe('Label Component', () => {
    it('should render the label', () => {
        const {getByText} = renderWithReactIntl(<Label translationKey="SOME_TEXT" defaultValue="somelabel"/>);
        getByText('somelabel');
    });

    it('should disable the label when disabled is true', () => {
        const {container} = renderWithReactIntl(<Label translationKey="SOME_TEXT" defaultValue="somelabel" disabled={true}/>);
        expect(container.querySelector('.disabledLabelContainer'));
    })
});
