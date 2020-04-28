import React, { useState, useEffect } from 'react'
import classNames from 'classnames';
import { appointmentListView, noAppointmentsListView, sortIcon, selected, tableMidWidth } from './ListView.module.scss'
import moment from 'moment'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown'
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ListView({ columns = {}, rows = [], colorRow = () => { } }) {
    const [sortColumn, setSortColumn] = useState("")
    const [ascending, setAscending] = useState(true)
    const [listItems, setListItems] = useState(rows)
    const [selectedAppointment, setSelectedAppointment] = useState(null)

    function sort(sortOrder) {
        return [...listItems].sort((listItem1, listItem2) => {
            if (sortColumn.includes("Date")) {
                const listItem1SortColumn = moment(listItem1[sortColumn]),
                    listItem2SortColumn = moment(listItem2[sortColumn])
                return compareTime(listItem1SortColumn, listItem2SortColumn, sortOrder)
            } else if (sortColumn.includes("Time")) {
                const listItem1SortColumn = moment(listItem1[sortColumn], 'h:mm a'),
                    listItem2SortColumn = moment(listItem2[sortColumn], 'h:mm a')

                return compareTime(listItem1SortColumn, listItem2SortColumn, sortOrder)
            } else {
                const listItem1SortColumn = listItem1[sortColumn] ? listItem1[sortColumn].toLowerCase() : "",
                    listItem2SortColumn = listItem2[sortColumn] ? listItem2[sortColumn].toLowerCase() : ""
                return compare(listItem1SortColumn, listItem2SortColumn, sortOrder)
            }
        })
    }

    function compareTime(time1, time2, sortOrder) {
        if (time1.isBefore(time2)) {
            return -1 * sortOrder
        } else if (time1.isAfter(time2)) {
            return 1 * sortOrder
        } else {
            return 0
        }
    }

    function compare(item1, item2, sortOrder) {
        if (item1 < item2) {
            return -1 * sortOrder
        } else if (item1 > item2) {
            return 1 * sortOrder
        } else {
            return 0
        }
    }


    useEffect(() => {
        if (ascending) {
            setListItems(sort(1))
        } else {
            setListItems(sort(-1))
        }
    }, [ascending, sortColumn])


    function renderSortIcon(column) {
        const icon = ascending ? faCaretUp : faCaretDown
        if (sortColumn === column) {
            return <FontAwesomeIcon data-testid="sortIcon" icon={icon} className={classNames(sortIcon)} onClick={() => setAscending(!ascending)} />
        }
        return null
    }

    if (listItems.length === 0) {
        return (
            <div className={classNames(noAppointmentsListView)}>
                No appointments found
            </div>)
    }
    return (
        <table className={classNames(appointmentListView)}>
            <thead>
                <tr>
                    {Object.keys(columns).map(column => {
                        let contentLength = ""
                        if (columns[column] === "mid") {
                            contentLength = tableMidWidth
                        }
                        return (
                            <th key={column} className={classNames(contentLength)} onClick={() => setSortColumn(column)}>
                                {column}
                                {renderSortIcon(column)}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {listItems.map((listItem, index) => {
                    return (<tr key={index} className={selectedAppointment === listItem ? classNames(selected) : null} onClick={() => setSelectedAppointment(listItem)}>
                        {Object.keys(listItem).map((header, index) => {

                            let contentLength = ""
                            if (columns[header] === "mid") {
                                contentLength = tableMidWidth
                            }
                            return (<td key={index} className={classNames(contentLength, colorRow(listItem))}>{listItem[header]}</td>)
                        })}
                    </tr>)
                })}
            </tbody>
        </table>)
}