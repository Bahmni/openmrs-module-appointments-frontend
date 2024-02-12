import React from "react";
import {injectIntl, useIntl} from "react-intl";
import "./GridSummary.module.scss";
import moment from "moment";
import { sortBy } from "lodash";
import {tableGridWrapper,tableGridSummary,tableTotalCount,missedCount,currentDateColumn, noAppointments, gridHeading} from './GridSummary.module.scss'
import classNames from 'classnames'
import {AppContext} from "../AppContext/AppContext";

export const transformAppointmentSummaryToGridData=(gridData)=>{
  return gridData.map(dataElement => {
    let rowList = [];
    for (let element in dataElement.appointmentCountMap) {
      rowList.push({
        date: element,
        count: dataElement.appointmentCountMap[element].allAppointmentsCount,
        missedCount:
        dataElement.appointmentCountMap[element].missedAppointmentsCount,
        uuid: dataElement.appointmentCountMap[element].appointmentServiceUuid
      });
    }
    return {
      rowLabel: dataElement.appointmentService.name,
      rowDataList: sortBy(rowList, dateObj => moment(dateObj.date))
    };
  });
}
export const transformData = (gridData)=>{
  let rowMap = []
  for(let uuid in gridData){
    if(uuid !== "undefined"){
      const rowList = []
      for(let rowData in gridData[uuid].data){
        rowList.push({
          date: rowData,
          uuid: gridData[uuid]["data"][rowData].uuid,
          count: gridData[uuid]["data"][rowData].count,
          missedCount: gridData[uuid]["data"][rowData].missedCount
        })
      }
      rowMap.push({rowLabel:gridData[uuid].name, rowDataList: rowList})
    }
  }
  return sortBy(rowMap, row => row.rowLabel.toLowerCase())
}
export const setMap = ( map, date, name, uuid, status) => {
  if(!map[uuid]){
    map[uuid] = {
      name: name,
      data:{}
    }
  }
  if(!map[uuid]["data"][date]){
    map[uuid]["data"][date]= {
      uuid,
      count: 0,
      missedCount:0
    }
  }
  map[uuid]["data"][date].count += 1
  if(status === "Missed"){
    map[uuid]["data"][date].missedCount += 1;
  }
}

export const transformAppointmentsData = (data) => {
  const specialityMap = {}
  const providerMap = {}
  const locationMap = {}
  for(let element in data) {
    const {service, startDateTime, provider, providers, location, status} = data[element]
    if(status !== 'Cancelled'){
      const { speciality } = service
      const date = moment(startDateTime).format("YYYY-MM-DD")
      setMap(specialityMap, date, speciality.name, speciality.uuid, status)
      if(provider){
        setMap(providerMap, date, provider.name, provider.uuid, status)
      }
      else{
        for(let i in providers){
          setMap(providerMap, date, providers[i].name, providers[i].uuid, status)
        }
      }
      if(location) {
        setMap(locationMap, date, location.name, location.uuid, status)
      }
    }
  }
  return [transformData(specialityMap),
  transformData(providerMap),
  transformData(locationMap)]
}
const loadMessage = (message, gridName) => {
  return <div className={classNames(tableGridWrapper)}>
    <h3 className={gridHeading}>{gridName}</h3>
    <table className={tableGridSummary}>
      <tbody>
      <tr>
        <td></td>
        <td className={noAppointments}>
          {message}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
}
const GridSummary = props => {
  const { gridData=[], weekStartDate = moment().startOf("isoweek"), onClick, gridName, noAppointmentsMessage } = props;
  let week = []
  const { fullSummary, isLoading } = React.useContext(AppContext)
  const intl = useIntl();
  if(isLoading){
    return loadMessage(intl.formatMessage({id: "LOADING_APPOINTMENT_SUMMARY", defaultMessage: "Loading Appointments for the week"}), gridName);
  }
  if(gridData.length === 0 && fullSummary){
    return loadMessage(noAppointmentsMessage);
  }

  return (
      <div className={classNames(tableGridWrapper)}>
        <h3 className={gridHeading}>{gridName}</h3>
        <table className={tableGridSummary}>
          <thead>
          <tr>
            <td></td>
            {[...Array(7).keys()].map(index => {
              week.push({
                date: moment(moment(weekStartDate).add(index, "days")).format(
                    "YYYY-MM-DD"
                ),
                totalCount: 0,
                missedCount: 0
              });
              return (
                  <td key={'caption'+index}>
                    {moment(moment(weekStartDate).add(index, "days")).format(
                        "D MMM, ddd"
                    )}{" "}
                  </td>
              );
            })}
          </tr>
          </thead>
          <tbody>
          {gridData.map((row,index) => {
            return (
                <tr data-testid='row' key={'row'+index}>
                  <td key={row.rowLabel+index}>{row.rowLabel}</td>
                  {week.map((weekDay,index) => {
                    const a = row.rowDataList.find(
                        ele => ele.date === weekDay.date
                    );
                    let currentDate=weekDay.date===moment().format("YYYY-MM-DD")
                    if (a) {
                      weekDay.totalCount += a.count;
                      weekDay.missedCount += a.missedCount;
                      return (
                          <td key={row.rowLabel+index+weekDay.date} className={classNames({[currentDateColumn]:currentDate})}>
                            <a onClick={() => onClick(weekDay.date, a.uuid, gridName)}>{a.count}</a>
                            <span className={missedCount}>
                          {a.missedCount > 0
                              ? " (" + a.missedCount + " missed)"
                              : ""}
                        </span>
                          </td>
                      );
                    } else {
                      return <td key={row.rowLabel+index+weekDay.date} className={classNames({[currentDateColumn]:currentDate})}></td>;
                    }
                  })}
                </tr>
            );
          })}
          <tr className={tableTotalCount}>
            <td>Total</td>
            {week.map((weekDay,index) => {
              return (
                  <td key={'total'+index}>
                    <a onClick={() => onClick(weekDay.date)}>
                      {weekDay.totalCount > 0 ? weekDay.totalCount : ""}
                    </a>
                    <span className={missedCount}>
                    {weekDay.missedCount > 0
                        ? " (" + weekDay.missedCount + " missed)"
                        : ""}
                  </span>
                  </td>
              );
            })}
          </tr>
          </tbody>
        </table>
      </div>
  );
};
export default injectIntl(GridSummary);
