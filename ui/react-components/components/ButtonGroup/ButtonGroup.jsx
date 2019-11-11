import {FormattedMessage} from "react-intl";
import React from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {buttonGroup, selected} from './ButtonGroup.module.scss'

const ButtonGroup = props => {

    const {buttonsList, onClick, enable} = props;

    return (
        <div className={classNames(buttonGroup)}>
            {[...buttonsList.keys()].map(key => {
                const value = buttonsList.get(key);
                return (<button key={key} onClick={() => onClick(key)} data-testid={key}
                                className={classNames(value.isSelected && selected)} disabled={!enable}>
                    <FormattedMessage id={value.translationKey} defaultMessage={value.defaultValue}/>
                </button>);
            })}
        </div>
    )
};

ButtonGroup.propTypes = {
    buttonsList: PropTypes.instanceOf(Map).isRequired,
    onClick: PropTypes.func,
    enable: PropTypes.bool
};

export default ButtonGroup;
