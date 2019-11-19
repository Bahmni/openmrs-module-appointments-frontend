import React from "react";
import classNames from 'classnames';
import {inputButton, inputNumberContainer, disable} from './InputNumber.module.scss';
import PropTypes from 'prop-types';

const InputNumber = props => {
    const {defaultValue, onChange, isDisabled} = props;
    const onIncrease = () => {
        defaultValue ? onChange(Number(defaultValue) + 1) : onChange(1);
    };
    const onDecrease = () => defaultValue && onChange(Number(defaultValue) - 1);
    return (
        <div className={classNames(inputNumberContainer, isDisabled ? disable : '')}>
            <div>
                <button className={classNames('fa fa-chevron-left', inputButton)} data-testid="left-arrow"
                        onClick={onDecrease} disabled={defaultValue <= 1}/>
                <input type="number" value={defaultValue} min={1} data-testid="input-box"
                       onChange={event => onChange(event.target.value)}/>
                <button className={classNames('fa fa-chevron-right', inputButton)} data-testid="right-arrow"
                    onClick={onIncrease}/>
            </div>
        </div>
    );
};

InputNumber.propTypes = {
    defaultValue: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool
};
export default InputNumber;
