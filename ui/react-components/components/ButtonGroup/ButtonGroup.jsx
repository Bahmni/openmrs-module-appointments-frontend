import {FormattedMessage} from "react-intl";
import React from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {buttonGroup, selected} from './ButtonGroup.module.scss'
import Label from "../Label/Label.jsx";

const ButtonGroup = props => {

    const {buttonsList, onClick, enable = true } = props;

    return (
        <div>
            <div style={{fontSize: "12px", color: "black"}}>
                <Label translationKey={"REPEATS_ON_LABEL"} defaultValue={"Repeats On"}/>
            </div>

            <div className={classNames(buttonGroup)}>
                {[...buttonsList.keys()].map(key => {
                    const value = buttonsList.get(key);
                    return (<button key={key} onClick={() => onClick(key)} data-testid={key}
                                    className={classNames(value.isSelected && selected)} disabled={!enable}>
                        <FormattedMessage id={value.translationKey} defaultMessage={value.defaultValue}/>
                    </button>);
                })}
            </div>
        </div>
    )
};

ButtonGroup.propTypes = {
    buttonsList: PropTypes.instanceOf(Map).isRequired,
    onClick: PropTypes.func,
    enable: PropTypes.bool
};

export default ButtonGroup;
