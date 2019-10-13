import React, {Component} from "react";
import { injectIntl } from "react-intl";
import PropTypes from 'prop-types';

const ToggleButton = (props) => {
    const {label, disabled} = props;
    return (
            <label className={"toggle-btn-switch"}>
                <input type="checkbox" disabled={disabled}/>
                <span className={"toggle-btn-slider"} />
                {label}
            </label>
    );
};

export default injectIntl(ToggleButton);

ToggleButton.propTypes = {
    label: PropTypes.string,
    disabled: PropTypes.bool
};
