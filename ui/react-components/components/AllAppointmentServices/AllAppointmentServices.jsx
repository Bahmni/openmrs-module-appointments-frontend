import React from 'react'
import './AllAppointmentServices.module.css'


const AllAppointmentServices = props => { 
    
    const getKeys = () => {
    let keys = Object.keys(props.services[0]);
    return [...keys, 'Actions']
    }

    const getHeader = ()=>  {
        let keys = getKeys();
        return keys.map((key,index)=> <th key ={index}>{key}</th>);
    }

    const getService = (keys,data) => {
        return  keys.map((key,index)=> {
            if (key === "Description") {
                return <td key={index} className="service-disc-tablecell">{data[key]}</td>
            } else if (key === "Actions") {
                return <td key={index}>
                    <a data-testid="editservice" onClick={props.editService}>Edit</a>
                    <a data-testid="deleteservice" onClick={props.removeService}>Delete</a>
                    </td>
            }
            return <td key={index} >{data[key]}</td>})
    }

    const getRowsData = ()=>{
        let keys = getKeys();
        return props.services.map((row,index)=> <tr key={index}>{getService(keys,row)}</tr> )
    }

   
        return (<div>
            <table>
                <thead>
                    <tr>{getHeader()}</tr>  
                </thead>
                <tbody>
                    {getRowsData()}
                </tbody>
            </table>
        </div>)
    
};
export default AllAppointmentServices;