import React, { useState, Fragment } from 'react'
import { subDays } from "date-fns"
import { addDays } from "date-fns"
import DatePicker from 'react-datepicker'
import './SingleDatePicker.scss'
import "react-datepicker/dist/react-datepicker.css"


 const SingleDatePicker = () => {

 const [startDate, setStartDate] = useState(new Date());

 const handleChange = date => {
   setStartDate(date);
  }

 const goToPrev = date => {
    setStartDate(subDays(startDate,1));
 }

 const goToNext = date => {
     setStartDate(addDays(startDate,1));
 }

 return (
    
    <div className="app-date-nav">  
    <button onClick={goToPrev} className="app-view-prev" data-testid="prev"><i className="fa fa-angle-left" aria-hidden="true"></i></button>
    <DatePicker 
     selected={startDate}
     onChange={handleChange}
    />
    <button onClick={()=>goToNext()} data-testid="next" className="app-view-next"><i className="fa fa-angle-right" aria-hidden="true"></i></button>
    </div>
    
 )
}

export default SingleDatePicker;