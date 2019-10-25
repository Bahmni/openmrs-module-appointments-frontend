import React from 'react';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';

const Label = props => {
    const {translationKey, defaultValue, forInput} = props;
    return (
        <label for={forInput}><b><FormattedMessage id={translationKey} defaultMessage={defaultValue}/></b></label>
    )
}

Label.propTypes = {
    translationKey: PropTypes.string.isRequired,
    defaultValue: PropTypes.string.isRequired,
    forInput: PropTypes.string
};

export default Label;
