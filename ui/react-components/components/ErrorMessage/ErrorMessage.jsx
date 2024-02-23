import React from "react";
import classNames from "classnames";
import {messageHolder} from './ErrorMessage.module.scss'

import PropTypes from "prop-types";

const ErrorMessage = (props) => (
    <div className={classNames(messageHolder, props.className)} data-testid="error-message">
        <span>{props.message}</span>
    </div>
);

ErrorMessage.propTypes = {
    message: PropTypes.string
};

export default ErrorMessage;

