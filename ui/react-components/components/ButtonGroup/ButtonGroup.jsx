import {FormattedMessage} from "react-intl";
import React from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {buttonGroup} from './ButtonGroup.module.scss'

const ButtonGroup = props => {

    const {buttonsList} = props;

    return (
        <div className={classNames(buttonGroup)}>
            {buttonsList.map((button, i) =>
                <button key={i}><FormattedMessage id={button.translationKey}
                                                  defaultMessage={button.defaultValue}/></button>
            )}
        </div>
    )
};

ButtonGroup.propTypes = {
    buttonsList: PropTypes.array.isRequired
};

export default ButtonGroup;
