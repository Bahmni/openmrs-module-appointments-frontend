import React from "react"
import classNames from "classnames"
import {title, required} from "./Title.module.scss"
import PropTypes from "prop-types";

const Title = (props) => {
    const {text, isRequired} = props
    return <div className={classNames(title)}>
        <span>{text+ " "}</span>
        {isRequired && <span className={classNames(required)}>*</span>}
    </div>
};

Title.protoTypes = {
    text: PropTypes.string,
    isRequired: PropTypes.bool
}
export default Title;
