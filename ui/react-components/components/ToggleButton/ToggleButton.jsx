import React, {Component, Fragment} from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ToggleButton.module.scss';

const ToggleButton = (props) => {
    const {disabled, checked, handleToggle} = props;

    return (
        <Fragment>
            <input
                className={classNames("toggle-btn-checkbox")}
                type="checkbox"
                checked={checked}
                id='toggle-btn-checkbox'
                onChange={handleToggle}
                disabled={disabled}/>
            <label className={classNames("toggle-btn-label")} htmlFor='toggle-btn-checkbox'>
                <span className={classNames("toggle-btn-slider")}>
                </span>
            </label>
        </Fragment>
    );
};

export default ToggleButton;

ToggleButton.propTypes = {
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    handleToggle: PropTypes.func
};
