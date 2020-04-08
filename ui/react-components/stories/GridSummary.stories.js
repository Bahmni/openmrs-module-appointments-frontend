import React from 'react';
import GridSummary from '../components/GridSummary/GridSummary';
import {IntlProvider} from "react-intl";
import dummyData from '../components/GridSummary/AppointSummary.json';
export default { title: 'GridSummary' };


const withReactIntl = (GridSummary) => {
    return (props) =>{
        return <IntlProvider locale='en' messages={{'DROPDOWN_NO_OPTIONS_MESSAGE': 'no option'}}>
            <GridSummary {...props}/>
        </IntlProvider>
    }
}

const InternationalizedGridSummary = withReactIntl(GridSummary);

export const withPlaceholder = () => <InternationalizedGridSummary gridData={dummyData} onClick={(date)=>alert(date)}/>

