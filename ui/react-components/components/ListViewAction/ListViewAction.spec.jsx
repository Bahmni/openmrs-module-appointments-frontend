import React from "react";
import {render} from "@testing-library/react";
import CancelAction from "../ListViewAction/CancelAction";
import MissedAction from "../ListViewAction/MissedAction";
import CheckinAction from "../ListViewAction/CheckinAction";
import CompleteAction from "../ListViewAction/CompleteAction";

describe('List View Actions', () => {

  it('should render Cancel Action', () => {
    const {asFragment} = render(<CancelAction/>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render Complete Action', () => {
    const {asFragment} = render(<CompleteAction/>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render Missed Action', () => {
    const {asFragment} = render(<MissedAction/>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render Checkin Action', () => {
    const {asFragment} = render(<CheckinAction/>);
    expect(asFragment()).toMatchSnapshot();
  });
});
