import React, { Fragment } from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import classNames from "classnames";
import "./TabView.module.scss";

const tabView = ({ routes }) => {
  return (
    <div data-testid="tabview">
      <nav>
        <ul className={classNames("tab-view")}>
          {routes.map(route => {
            return (
              <li key={route.path}>
                <NavLink exact={true} activeClassName="active" to={route.path}>
                  {route.heading}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      <hr className={classNames("horizontal-line")} />
      <Switch>
        <Fragment>
          {routes.map(route => {
            return (
              <div key={route.path}>
                {route.path === "/" ? (
                  <Route exact path={route.path}>
                    {route.component}
                  </Route>
                ) : (
                  <Route path={route.path}>{route.component}</Route>
                )}
              </div>
            );
          })}
        </Fragment>
      </Switch>
    </div>
  );
};

export default tabView;
