import classNames from "classnames";
import {dropdownIndicator} from "./Dropdown.module.scss";
import React from "react";

export const DropdownIndicator = () => {
    return <i className={classNames("fa", "fa-angle-down", "fa-lg", dropdownIndicator)}/>;
};
