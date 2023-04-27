import React from "react";
import { injectIntl } from "react-intl";
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
  for(let data in gridData){
    const rowList = []
    for(let rowData in gridData[data]){
      rowList.push({
        date: rowData,
        uuids: gridData[data][rowData].uuids,
        count: gridData[data][rowData].count
      })
    }
    rowMap.push({rowLabel:data, rowDataList: rowList})
  }
  return sortBy(rowMap, row => row.rowLabel)
}
export const setMap = ( map, date, name, uuid) => {
  if(!map[name]){
    map[name]={}
  }
  if(!map[name][date]){
    map[name][date]= {
      uuids: [],
      count: 0
    }
  }
  map[name][date].uuids.push(uuid);
  map[name][date].count += 1
}

export const transformAppointmentsData = (data) => {
  const specialityMap = {}
  const providerMap = {}
  const locationMap = {}
  for(let element in data) {
    const {service, startDateTime, provider, providers, location} = data[element]
    const { uuid, speciality } = service
    const date = moment(startDateTime).format("YYYY-MM-DD")
    setMap(specialityMap, date, speciality.name, uuid)
    if(provider){
      setMap(providerMap, date, provider.name, uuid)
    }
    else{
      for(let i in providers){
        setMap(providerMap, date, providers[i].name, uuid)
      }
    }
    if(location) {
      setMap(locationMap, date, location.name, uuid)
    }
  }
  return [transformData(specialityMap),
  transformData(providerMap),
  transformData(locationMap)]
}

const GridSummary = props => {
  const { gridData=[], weekStartDate = moment().startOf("isoweek"), onClick, gridName } = props;
  let week = []
  const { fullSummary } = React.useContext(AppContext)
  if(gridData.length === 0 && fullSummary){
    return (
        <div className={classNames(tableGridWrapper)}>
          <h3 className={gridHeading}>{gridName}</h3>
          <table className={tableGridSummary}>
            <tbody>
              <tr>
                <td></td>
                <td className={noAppointments}>This week, no appointment is available for any of the {gridName}</td>
              </tr>
            </tbody>
          </table>
        </div>)
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
                      let uuids = a.uuid? [a.uuid] : a.uuids
                      return (
                          <td key={row.rowLabel+index+weekDay.date} className={classNames({[currentDateColumn]:currentDate})}>
                            <a onClick={() => onClick(weekDay.date, uuids)}>{a.count}</a>
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
