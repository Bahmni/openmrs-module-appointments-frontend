import React from "react";
import classNames from 'classnames';
import {inputButton, inputNumberContainer} from './InputNumber.module.scss';
import PropTypes from 'prop-types';

const InputNumber = props => {
    const {defaultValue, onInputChange} = props;
    const onIncrease = () => {
        defaultValue ? onInputChange(Number(defaultValue) + 1) :
            onInputChange(1);
    };
    const onDecrease = () => defaultValue && onInputChange(Number(defaultValue) - 1);
    return (
        <div className={classNames(inputNumberContainer)}>
            <button className={classNames('fa fa-chevron-left', inputButton)}
                    onClick={onDecrease} disabled={defaultValue <= 1}/>
            <input data-testid="recurrence-period" type="number" value={defaultValue} min={1}
                   onChange={event => onInputChange(event.target.value)}/>
            <button className={classNames('fa fa-chevron-right', inputButton)}
                    onClick={onIncrease}/>
        </div>
    );
};

InputNumber.propTypes = {
    defaultValue: PropTypes.number,
    onInputChange: PropTypes.func.isRequired
};
export default InputNumber;
