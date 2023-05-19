import React from "react";
import { NumberInput } from 'carbon-components-react';
const NumberInputCarbon = props => {
    const {onChange, value, id} = props;
    const handleChange = (event, carbonEvent, value) => {
        if(typeof carbonEvent === "object"){
            onChange(+carbonEvent.value);
        }
        else {
            onChange(value);
        }
    }

    return <NumberInput
        data-testid="recurrence-period"
        id={id}
        onChange={handleChange}
        min={0}
        value = { value || 0}
        invalidText={null}
    />
}

export default NumberInputCarbon;