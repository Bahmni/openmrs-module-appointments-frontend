import React from "react";
import PropTypes from "prop-types";
import {DatePicker, DatePickerInput} from "carbon-components-react";
import moment from "moment";
import Title from "../Title/Title.jsx";
const DatePickerCarbon = props => {

    const {onChange, value, title, minDate, testId, width, isDisabled, isRequired} = props;
    let defaultTime = value;
    if( value && value instanceof moment){
        defaultTime = value.format("MM/DD/YYYY");
    }
    let titleText=  title && <Title text={title} isRequired={isRequired}/>
    return (
        <div data-testid={testId || "datePicker"}>
            <DatePicker datePickerType={"single"} onChange={onChange} disabled={isDisabled} minDate={minDate} value={defaultTime}>
                <DatePickerInput
                    id={"Appointment Date"}
                    placeholder={"mm/dd/yyyy"}
                    labelText={titleText}
                    size={"md"}
                    style={{width: width || "250px"}}
                    autoComplete={"off"}
                    disabled={isDisabled}
                    required={isRequired}
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
    isRequired: PropTypes.bool,
};

export default DatePickerCarbon;
