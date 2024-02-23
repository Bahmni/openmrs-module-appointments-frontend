import React from "react";
import { NumberInput } from 'carbon-components-react';
import Title from "../Title/Title.jsx";
const NumberInputCarbon = props => {
    const {onChange, value, id, testId, label, isRequired} = props;
    const handleChange = (event, carbonEvent, value) => {
        if(typeof carbonEvent === "object"){
            onChange(+carbonEvent.value);
        }
        else {
            onChange(value);
        }
    }
    const title = label && <Title text={label} isRequired={isRequired}/>;

    return <NumberInput
        data-testid={testId}
        id={id}
        onChange={handleChange}
        min={0}
        value = { value || 0}
        invalidText={null}
        label={title}
    />
}

export default NumberInputCarbon;