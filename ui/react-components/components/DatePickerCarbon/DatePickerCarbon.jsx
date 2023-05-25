import React from "react";
import PropTypes from "prop-types";
import {DatePicker, DatePickerInput} from "carbon-components-react";
import moment from "moment";
const DatePickerCarbon = props => {

    const {onChange, value, title, minDate, testId, width, isDisabled} = props;
    let defaultTime = value;
    if( value && value instanceof moment){
        defaultTime = value.format("MM/DD/YYYY");
    }
    return (
        <div data-testid={testId || "datePicker"}>
            <DatePicker datePickerType={"single"} onChange={onChange} disabled={isDisabled} minDate={minDate || moment().format("MM-DD-YYYY")} value={defaultTime}>
                <DatePickerInput
                    id={"Appointment Date"}
                    placeholder={"mm/dd/yyyy"}
                    labelText={title}
                    size={"md"}
                    style={{width: width || "250px"}}
                    autoComplete={"off"}
                    disabled={isDisabled}
                />
            </DatePicker>
        </div>

    );
};

DatePickerCarbon.propTypes = {
    onChange: PropTypes.func,
    width: PropTypes.string,
    title: PropTypes.string,
    testId: PropTypes.string,
    isDisabled: PropTypes.bool,
};

export default DatePickerCarbon;
