import {FormattedMessage} from "react-intl";
import React from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {buttonGroup, selected} from './ButtonGroup.module.scss'

const ButtonGroup = props => {

    const {buttonsList, onClick, enable} = props;

    return (
        <div className={classNames(buttonGroup)}>
            {[...buttonsList.keys()].map(key =>
                <button key={key} onClick={() => onClick(key)} data-testid={key}
                        className={classNames(buttonsList.get(key).isSelected && selected)} disabled={!enable}>
                    <FormattedMessage id={buttonsList.get(key).translationKey}
                                      defaultMessage={buttonsList.get(key).defaultValue}/>
                </button>
            )}
        </div>
    )
};

ButtonGroup.propTypes = {
    buttonsList: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    enable: PropTypes.bool.isRequired
};

export default ButtonGroup;
