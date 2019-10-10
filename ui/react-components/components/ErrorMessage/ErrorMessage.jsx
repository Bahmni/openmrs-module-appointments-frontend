import React from "react";
import classNames from "classnames";
import {messageHolder} from './ErrorMessage.module.scss'

import PropTypes from "prop-types";

const ErrorMessage = (props) => (
    <div className={classNames(messageHolder)}>
        <span>{props.message}</span>
    </div>
);

ErrorMessage.propTypes = {
    message: PropTypes.string
};

export default ErrorMessage;

