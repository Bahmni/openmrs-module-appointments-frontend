import {components} from "react-select";
import classNames from "classnames";
import {searchIcon} from "./Dropdown.module.scss";
import React from "react";

export const ValueContainer = ({children, ...props}) => {
    return (
        components.ValueContainer && (
            <components.ValueContainer {...props}>
                {!!children && (
                    <i
                        className={classNames("fa", "fa-search", searchIcon)}
                        aria-hidden="true"
                    />
                )}
                {children}
            </components.ValueContainer>
        )
    );
};
