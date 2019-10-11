import React from 'react'
import './AllAppointmentServices.scss'

export class AllAppointmentServices extends React.Component{
    constructor(props){
        super(props);
        this.getKeys =this.getKeys.bind(this);
        this.getHeader =this.getHeader.bind(this);
        this.getRowsData =this.getRowsData.bind(this);
    }

    getKeys = function () {
        let keys = Object.keys(this.props.services[0]);
        keys.push("Actions");
        return keys;
    }

    getHeader = function () {
        var keys = this.getKeys();
        return keys.map((key,index)=>{
                return <th key ={index}>{key}</th>
        })
    }

    getService = function(keys,data) {
        var self = this;
        return  keys.map((key,index)=>{
            if(key === "Description")
            {
                return <td key={index} className="service-disc-tablecell">{data[key]}</td>
            }
            else if(key === "Actions")
            {
                return <td key={index}>
                    <a id="editservice" onClick={self.props.editService}>Edit</a>
                    <a id="deleteservice" onClick={self.props.removeService}>Delete</a>
                    </td>
            }
            return <td key={index} >{data[key]}</td>})
    }

    getRowsData = function(){
        var keys = this.getKeys(); 
        var self = this;
        return this.props.services.map((row,index)=>{

            return <tr key={index}>
                {this.getService(keys,row)}
                </tr>

        });
    }

    render(){ 
        return <div>
            <table>
                <thead>
                <tr>
                    {this.getHeader()}
                    </tr>  
                </thead>
                <tbody>
                    {this.getRowsData()}
                </tbody>
            </table>
        </div>
    }
};