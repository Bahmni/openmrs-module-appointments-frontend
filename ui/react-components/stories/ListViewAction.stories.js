import CheckinAction from "../components/ListViewAction/CheckinAction";
import MissedAction from "../components/ListViewAction/MissedAction";
import CompleteAction from "../components/ListViewAction/CompleteAction";
import CancelAction from "../components/ListViewAction/CancelAction";
import React from "react";

export default {title: 'List View Actions'};

export const missed = () => <MissedAction/>;
export const checkin = () => <CheckinAction/>;
export const complete = () => <CompleteAction/>;
export const cancel = () => <CancelAction/>;
