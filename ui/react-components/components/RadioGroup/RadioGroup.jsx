import React from "react";
import {radioButton, radioGroup} from "./RadioGroup.module.scss";
import classNames from "classnames";
import PropTypes from "prop-types";
import Label from '../Label/Label.jsx';


const RadioGroup = props => {
    const {
        firstDefaultValue, groupName, onChange,
        firstTranslationKey, secondTranslationKey, secondDefaultValue
    } = props;
    return (<div className={classNames(radioGroup)}>
        <div className={classNames(radioButton)}>
            <input
                type="radio"
                value={firstDefaultValue}
                name={groupName}
                className={classNames(radioGroup)}
                onChange={onChange}
            />
            <Label translationKey={firstTranslationKey} defaultValue={firstDefaultValue}/>
        </div>
        <div className={classNames(radioButton)}>
            <input
                type="radio"
                value={secondDefaultValue}
                name={groupName}
                className={classNames(radioGroup)}
                onChange={onChange}
            />
            <Label translationKey={secondTranslationKey} defaultValue={secondDefaultValue}/>
        </div>
    </div>)
};

RadioGroup.propTypes = {
    firstTranslationKey: PropTypes.string,
    firstDefaultValue: PropTypes.string,
    secondTranslationKey: PropTypes.string,
    secondDefaultValue: PropTypes.string,
    groupName: PropTypes.string,
    onChange: PropTypes.func
};

export default RadioGroup;
