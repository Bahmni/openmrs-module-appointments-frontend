import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames';
import './ListView.module.scss'
import * as moment from 'moment'

export default function ListView({ columns = {}, rows = [] }) {
    const [sortColumn, setSortColumn] = useState("")
    const [ascending, setAscending] = useState(true)
    const [listItems, setListItems] = useState(rows)

    
    function sort(sortOrder) {
        return [...listItems].sort((listItem1, listItem2) => {
            if (sortColumn.includes("Date")) {
                const listItem1SortColumn = Date.parse(listItem1[sortColumn]),
                    listItem2SortColumn = Date.parse(listItem2[sortColumn])
                return compare(listItem1SortColumn, listItem2SortColumn, sortOrder)
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
        const sortIconClassName = ascending ? "fa-caret-up" : "fa-caret-down"
        if (sortColumn === column) {
            return (<i data-testid="sortIcon" className={classNames("fa", sortIconClassName)} onClick={() => setAscending(!ascending)}></i>)
        }
        return null
    }

    if (listItems.length === 0) {
        return (
            <div className={classNames("no-appointments-list-view")}>
                No appointments found
            </div>)
    }
    return (
        <table className={classNames("appointment-list-view")}>
            <thead>
                <tr>
                    {Object.keys(columns).map(column => {
                        let contentLength = ""
                        if (columns[column] === "mid") {
                            contentLength = "table-mid-width"
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
                {listItems.map((listItem,index) => {
                    return (<tr key={index}>
                        {Object.keys(listItem).map((header,index) => {

                            let contentLength = ""
                            if (columns[header] === "mid") {
                                contentLength = "table-mid-width"
                            }
                            return (<td key={index} className={classNames(contentLength)}>{listItem[header]}</td>)
                        })}
                    </tr>)
                })}
            </tbody>
        </table>)
}