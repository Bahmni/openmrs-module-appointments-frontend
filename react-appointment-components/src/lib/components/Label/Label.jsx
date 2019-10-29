import React from 'react';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';

const Label = props => {
    const { translationKey, defaultValue } = props;
    return (
        <label><b><FormattedMessage id={translationKey} defaultMessage={defaultValue}/></b></label>
    )
}

Label.propTypes = {
    translationKey: PropTypes.string.isRequired,
    defaultValue: PropTypes.string.isRequired
};

export default Label;
