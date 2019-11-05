import React from 'react';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import classNames from "classnames";
import {disabledLabelContainer} from './Label.module.scss'

const Label = props => {
    const {translationKey, defaultValue, forInput, disabled} = props;
    return (
        <label htmlFor={forInput} className={disabled ? classNames(disabledLabelContainer) : classNames('')}><b>
            <FormattedMessage id={translationKey} defaultMessage={defaultValue}/></b>
        </label>
    )
};

Label.propTypes = {
    translationKey: PropTypes.string.isRequired,
    defaultValue: PropTypes.string.isRequired,
    forInput: PropTypes.string,
    disabled: PropTypes.bool
};

export default Label;
