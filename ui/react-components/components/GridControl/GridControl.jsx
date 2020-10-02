import React, {useState} from "react";
import moment from 'moment';
import PropTypes from "prop-types";
import {getWeekStartDate} from "../../utils/DateOrWeekNavigator/weekDatesHelper";
import DateOrWeekNavigator from "../DateOrWeekNavigator/DateOrWeekNavigator";
import GridSummary from "../GridSummary/GridSummary";
import { gridControlWeekNavigator } from "./GridControl.module.scss";

const GridControl = (props) => {
   const { gridData, weekStart, onClick} = props;
   
   const [weekStartDate, setWeekStartDate] = useState(() => getWeekStartDate(moment().toDate(), weekStart));

   return (
    <>
       <DateOrWeekNavigator 
         isWeek = {true} 
         weekStart= {weekStart} 
         userDefinedClassname={gridControlWeekNavigator} 
         onWeekStartDateChange={(date) => {setWeekStartDate(date); }}
       />
       <GridSummary gridData={gridData} weekStartDate={weekStartDate} onClick={onClick}/>
    </>
   );
}

export default GridControl;

GridControl.propTypes = {
    gridData: PropTypes.array,
    weekStart: PropTypes.number,
    onClick: PropTypes.func,
};
