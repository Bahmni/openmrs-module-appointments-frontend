import React, {useState} from 'react';
import LocationSearch from '../components/Location/LocationSearch';
import {IntlProvider} from "react-intl";


export default { title: 'Location Search' };
// const locationSearch=<LocationSearch value="Enter Location" />

const withReactIntl = (LocationSearch) => {
    return (props) =>{
        return <IntlProvider locale='en' messages={{'Location': 'no Location selected'}}>
            <LocationSearch {...props}/>
        </IntlProvider>
    }
}

const InternationalizedLocation=withReactIntl(LocationSearch)

export const basic = () => (<InternationalizedLocation/>);

