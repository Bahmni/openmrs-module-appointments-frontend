import React from 'react';
import Dropdown from '../components/Dropdown/Dropdown';

export default { title: 'Dropdown' };

const colourOptions = [
    {value: 'ocean', label: 'Ocean'},
    {value: 'blue', label: 'Blue'},
    {value: 'orange', label: 'Orange'},
    {value: 'yellow', label: 'Yellow'},
    {value: 'green', label: 'Green'},
    {value: 'forest', label: 'Forest'},
    {value: 'slate', label: 'Slate'},
    {value: 'silver', label: 'Silver'}
];

export const withPlaceholder = () => <Dropdown placeholder="Sample placeholder"></Dropdown>;

export const withOptions = () => <Dropdown placeholder="Select color" options={colourOptions}></Dropdown>;
