import { configure } from '@storybook/react';

configure(require.context('../react-components', true, /\.stories\.js$/), module);