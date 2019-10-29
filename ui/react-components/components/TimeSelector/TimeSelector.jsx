import React from 'react';
import PropTypes from 'prop-types';
import Label from "../Label/Label.jsx";
import AppointmentTimePicker from "../TimePicker/TimePicker.jsx";
import classNames from 'classnames';
import {timeSelector} from './TimeSelector.module.scss';
import {injectIntl} from "react-intl";

const TimeSelector = props => {

    return (
        <div className={classNames(timeSelector)}>
            <div>
                <Label translationKey={props.translationKey}
                       defaultValue={props.defaultValue}/>
            </div>
            <AppointmentTimePicker onChange={props.onChange}
                                   placeHolderTranslationKey={props.timeSelectionTranslationKey}
                                   defaultValue={props.timeSelectionDefaultValue}/>
        </div>
    )
};


TimeSelector.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    translationKey: PropTypes.string,
    defaultValue: PropTypes.string.isRequired,
    timeSelectionTranslationKey: PropTypes.string,
    timeSelectionDefaultValue: PropTypes.string.isRequired,
};

export default injectIntl(TimeSelector);
