import React from "react";
import classNames from 'classnames';
import {inputNumberContainer, tagRemove} from './InputNumber.module.scss';
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
            <button className={classNames('fa fa-chevron-left', tagRemove)}
                    onClick={onDecrease} disabled={defaultValue <= 1}/>
            <input type="number" value={defaultValue}
                   onChange={event => onInputChange(event.target.value)}/>
            <button className={classNames('fa fa-chevron-right', tagRemove)}
                    onClick={onIncrease}/>
        </div>
    );
};

InputNumber.propTypes = {
    defaultValue: PropTypes.number,
    onInputChange: PropTypes.func.isRequired
};
export default InputNumber;
