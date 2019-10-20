import React, {Component, Fragment} from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ToggleButton.module.scss';

const ToggleButton = (props) => {
    const {disabled} = props;

    return (
        <Fragment>
            <input
                className={classNames("toggle-btn-checkbox")}
                type="checkbox"
                id='toggle-btn-checkbox'
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
    disabled: PropTypes.bool
};
