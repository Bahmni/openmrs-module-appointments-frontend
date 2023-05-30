import React from 'react';
import PropTypes from 'prop-types';
import AppointmentTimePicker from "../TimePicker/TimePicker.jsx";
import {injectIntl} from "react-intl";

const TimeSelector = props => {

    const { translationKey, defaultValue, onChange, defaultTime, isDisabled, width, isRequired } = props;
    return (
        <div>
            <AppointmentTimePicker onChange={onChange}
                                   defaultTime={defaultTime}
                                   translationKey={translationKey}
                                   defaultTranslationKey={defaultValue}
                                   isRequired={isRequired}
                                   isDisabled={isDisabled} width={width}/>
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
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
    width: PropTypes.string,
};

export default injectIntl(TimeSelector);
