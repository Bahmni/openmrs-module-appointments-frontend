import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import Label from './Label.jsx';
import {render} from '@testing-library/react';

describe('Label Component', () => {
    it('should render the label', () => {
        const {getByText} = render(<Label translationKey="SOME_TEXT" defaultValue="somelabel"/>);
        getByText('somelabel');
    });
});
