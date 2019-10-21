import React from 'react';
import ToggleButton from '../components/ToggleButton/ToggleButton';

export default { title: 'ToggleButton' };

export const basic = () => (<ToggleButton></ToggleButton>);

export const disabled = () => (<ToggleButton disabled></ToggleButton>);

export const defaultChecked = () => (<ToggleButton checked></ToggleButton>);
