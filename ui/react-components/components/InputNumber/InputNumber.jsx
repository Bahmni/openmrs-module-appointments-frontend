import React from "react";
import classNames from 'classnames';
import {inputButton, inputNumberContainer} from './InputNumber.module.scss';
import PropTypes from 'prop-types';

const InputNumber = props => {
    const {defaultValue, onInputChange} = props;
    const onIncrease = () => {
        defaultValue === undefined ?
            onInputChange(1) : onInputChange(Number(defaultValue) + 1);
    };

    const onDecrease = () => defaultValue !== undefined && onInputChange(Number(defaultValue) - 1);
    return (
        <div className={classNames(inputNumberContainer)}>
            <button className={classNames('fa fa-chevron-left', inputButton)}
                    onClick={onDecrease} disabled={defaultValue <= 1}/>
            <input type="number" value={defaultValue} min={1}
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
