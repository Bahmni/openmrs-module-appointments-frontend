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
        timeSelectionTranslationKey, timeSelectionDefaultValue, defaultTime
    } = props;
    return (
        <div className={classNames(timeSelector)}>
            <div>
                <Label translationKey={translationKey}
                       defaultValue={defaultValue}/>
            </div>
            <AppointmentTimePicker onChange={onChange}
                                   placeHolderTranslationKey={timeSelectionTranslationKey}
                                   defaultValue={timeSelectionDefaultValue} defaultTime={defaultTime}
            />
        </div>
    )
};


TimeSelector.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    translationKey: PropTypes.string,
    defaultValue: PropTypes.string.isRequired,
    timeSelectionTranslationKey: PropTypes.string,
    defaultTime: PropTypes.object,
    timeSelectionDefaultValue: PropTypes.string.isRequired,
};

export default injectIntl(TimeSelector);
