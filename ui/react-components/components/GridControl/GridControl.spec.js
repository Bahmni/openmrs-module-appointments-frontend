import React from "react";
import moment from 'moment';
import {fireEvent} from '@testing-library/react';
import {renderWithReactIntl} from '../../utils/TestUtil';
import '@testing-library/jest-dom/extend-expect';
import GridControl from "./GridControl";
import data from '../GridSummary/AppointSummary.json'
import { getWeekStartDate, getWeekEndDate } from "../../utils/DateOrWeekNavigator/weekDatesHelper";

describe("Grid Control",()=>{
    it("should render the both grid summary and date navigator",()=>{
        const {container} = renderWithReactIntl(<GridControl gridData={data} weekStart={5} onClick={jest.fn()}/>);
        expect(container.querySelector('.tableGridSummary')).toBeInTheDocument();
        expect(container.querySelector('.gridControlWeekNavigator')).toBeInTheDocument();
    });

    it("should update the date row of grid when week start date is changed in data navigator",()=>{
        const {container, getByTestId, getByText} = renderWithReactIntl(
          <GridControl 
            gridData={data} 
            weekStart={7} 
          />);
          const today = moment().format('YYYY-MM-DD');
          let weekStartDate = getWeekStartDate(today, 7);
          let weekEndDate = getWeekEndDate(today, 7);
          let header = container.querySelector('thead > tr > td:nth-child(2)');
          expect(header.textContent).toContain(weekStartDate);
          expect(getByText(weekStartDate+' - '+weekEndDate)).toBeInTheDocument();

          const previousWeekButton = getByTestId('leftNavigator');
          fireEvent.click(previousWeekButton);

          const lastWeek = moment().subtract(7, "days").format('YYYY-MM-DD');
          weekStartDate = getWeekStartDate(lastWeek, 7);
          weekEndDate = getWeekEndDate(lastWeek, 7);
          header = container.querySelector('thead > tr > td:nth-child(2)');
          expect(header.textContent).toContain(weekStartDate);
          expect(getByText(weekStartDate+' - '+weekEndDate)).toBeInTheDocument();
    });
})
