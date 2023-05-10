import React from 'react';
import PropTypes from 'prop-types';
import Label from "../Label/Label.jsx";
import AppointmentTimePicker from "../TimePicker/TimePicker.jsx";
import classNames from 'classnames';
import {timeSelector} from './TimeSelector.module.scss';
import {injectIntl} from "react-intl";

const TimeSelector = props => {

    const {
        translationKey, defaultValue, onChange,
        placeHolderTranslationKey, placeHolderDefaultMessage, defaultTime, isDisabled
    } = props;
    return (
        <div>
            <AppointmentTimePicker onChange={onChange}
                                   defaultTime={defaultTime}
                                   translationKey={translationKey}
                                   defaultTranslationKey={defaultValue}
                                   isDisabled={isDisabled} />
        </div>
    )
};


TimeSelector.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    translationKey: PropTypes.string,
    defaultValue: PropTypes.string.isRequired,
    placeHolderTranslationKey: PropTypes.string,
    defaultTime: PropTypes.object,
    placeHolderDefaultMessage: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool
};

export default injectIntl(TimeSelector);
