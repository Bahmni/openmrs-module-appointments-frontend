import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

const Label = props => {
    const { intl, translationKey, defaultValue } = props;
    const labelValue = intl.formatMessage({
        id: translationKey, defaultMessage: defaultValue
    });
    return (
        <label><b>{labelValue}</b></label>
    )
}

Label.propTypes = {
    intl: PropTypes.object.isRequired,
    translationKey: PropTypes.string.isRequired,
    defaultValue: PropTypes.string.isRequired
};

export default injectIntl(Label);