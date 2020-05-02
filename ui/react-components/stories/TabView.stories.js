import React from "react";
import TabView from "../components/TabView/TabView";
import { BrowserRouter as Router } from "react-router-dom";

export default { title: "Tab View menu" };

const routes = [
  {
    heading: "Summary",
    path: "/",
    component: "Pass component here ex : <ABC/>",
  },
  {
    heading: "Appointments List",
    path: "/list",
    component: "",
  },
];

export const basic = () => (
  <Router>
    <TabView routes={routes || []}></TabView>
  </Router>
);
