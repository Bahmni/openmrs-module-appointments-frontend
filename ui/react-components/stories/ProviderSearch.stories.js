import React from 'react'
import {IntlProvider} from "react-intl";
import ProviderSearch from '../components/Provider/ProviderSearch';


export default { title: 'Provider Search' };

const withReactIntl = (ProviderSearch) => {
    return (props) =>{
        return <IntlProvider locale='en' messages={{'Provider': 'no Provider selected'}}>
            <ProviderSearch {...props}/>
        </IntlProvider>
    }
}

const InternationalizedProviderSearch=withReactIntl(ProviderSearch)

export const basic = () => (<InternationalizedProviderSearch/>);

