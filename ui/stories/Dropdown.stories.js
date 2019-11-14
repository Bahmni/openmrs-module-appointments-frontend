import React from 'react';
import Dropdown from '../react-components/components/Dropdown/Dropdown';
import {IntlProvider} from "react-intl";

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

const withReactIntl = (messages, WrappedComponent) => {
    return (props) => {
        return (<IntlProvider locale="en" messages={messages}>
            <WrappedComponent {...props}/>
        </IntlProvider>)

    }
}

const messages = {'PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PATIENT': 'Patient ID'};
const DropdownWithIntl = withReactIntl(messages , Dropdown)


export const withPlaceholder = () => <DropdownWithIntl placeholder="Sample placeholder"></DropdownWithIntl>;

export const withOptions = () => <DropdownWithIntl placeholder="Select color" options={colourOptions}></DropdownWithIntl>;


