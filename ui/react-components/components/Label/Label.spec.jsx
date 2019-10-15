import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {renderWithReactIntl} from '../../utils/TestUtil';
import Label from './Label.jsx';


describe('Label Component', () => {
   it('should render the label',() => {
      const {getByText} = renderWithReactIntl(<Label translationKey="SOME_TEXT" defaultValue="somelabel"/>);
      getByText('somelabel');
   });
});