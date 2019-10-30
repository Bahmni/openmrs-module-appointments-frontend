import {FormattedMessage} from "react-intl";
import React from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {buttonGroup, selected} from './ButtonGroup.module.scss'

const ButtonGroup = props => {

    const {buttonsList, onClick} = props;

    return (
        <div className={classNames(buttonGroup)}>
            {Object.keys(buttonsList).map((key) =>
                <button key={key} onClick={() => onClick(key)}
                        className={classNames(buttonsList[key].isSelected && selected)}><FormattedMessage
                    id={buttonsList[key].translationKey}
                    defaultMessage={buttonsList[key].defaultValue}/>
                </button>
            )}
        </div>
    )
};

ButtonGroup.propTypes = {
    buttonsList: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
};

export default ButtonGroup;
