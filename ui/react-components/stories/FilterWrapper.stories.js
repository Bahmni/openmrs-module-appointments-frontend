import React from 'react';
// import LocationSearch from '../components/Location/LocationSearch';
import {IntlProvider} from "react-intl";
import FilterWrapper from '../components/AppointmentFilterWrapper/FilterWrapper';


export default { title: 'Filter Search Wrapper' };
// const locationSearch=<LocationSearch value="Enter Location" />

const withReactIntl = (FilterWrapper) => {
    return (props) =>{
        return <IntlProvider locale='en' messages={{'Filter': 'Filter Wrapper for Appointments'}}>
            <FilterWrapper {...props}/>
        </IntlProvider>
    }
}

const InternationalizedLocation=withReactIntl(FilterWrapper)

export const basic = () => (<InternationalizedLocation/>);

