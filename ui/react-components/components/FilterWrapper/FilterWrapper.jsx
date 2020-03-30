import React from 'react'
import Label from '../Label/Label'
import ProviderSearch from '../Provider/ProviderSearch'
import LocationSearch from '../Location/LocationSearch'
import AppointmentStatus from '../AppointmentStatus/AppointmentStatus'
import classNames from 'classnames';
import './FilterWrapper.module.scss'


const FilterWrapper = props => {


    return (
        <div>
            <div className={classNames('appointment-filter-items')}>
             <Label translationKey='PROVIDER_FILTER' defaultValue='Provider'/>
             <ProviderSearch onClick={()=>console.log('provider search')} openMenuOnClick={false}
            openMenuOnFocus={false}/>
             </div>
             <div className={classNames('appointment-filter-items')}>
             <Label translationKey='LOCATION_FILTER' defaultValue='Location'/>
             <LocationSearch onClick={()=>console.log('provider search')} openMenuOnClick={false}
            openMenuOnFocus={false}/>
             </div>
             <div className={classNames('appointment-filter-items')}>
             <Label translationKey='APPOINTMENT_STATUS_FILTER' defaultValue='Appointment Status'/>
             <AppointmentStatus onClick={()=>console.log('provider search')} openMenuOnClick={false}
            openMenuOnFocus={false}/>
             </div>
        </div>
    )
}

export default FilterWrapper