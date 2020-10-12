import React from 'react';
import GridControl from '../components/GridControl/GridControl';
import {IntlProvider} from "react-intl";
import dummyData from '../components/GridSummary/AppointSummary.json';
export default { title: 'GridControl' };


const withReactIntl = (GridControl) => {
    return (props) =>{
        return <IntlProvider locale='en' messages={{'DROPDOWN_NO_OPTIONS_MESSAGE': 'no option'}}>
            <GridControl {...props}/>
        </IntlProvider>
    }
}

const InternationalizedGridControl = withReactIntl(GridControl);

export const withPlaceholder = () => <InternationalizedGridControl gridData={dummyData} weekStart = {7} onClick={(date)=>alert(date)}/>