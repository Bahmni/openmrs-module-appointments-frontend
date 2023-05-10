import React from "react";
import PropTypes from "prop-types";
import {DatePicker, DatePickerInput} from "carbon-components-react";
import 'carbon-components/css/carbon-components.min.css';
import moment from "moment";
const DatePickerCarbon = props => {

    const {onChange} = props;
    return (
        <DatePicker datePickerType={"single"} onChange={onChange} minDate={moment().format("MM-DD-YYYY")}>
            <DatePickerInput
                id={"Appointment Date"}
                placeholder={"mm/dd/yyyy"}
                labelText={"Appointment date"}
                size={"md"}
                style={{width:"250px"}}
            />
        </DatePicker>
    );
};

DatePickerCarbon.propTypes = {
    onChange: PropTypes.func
};

export default DatePickerCarbon;
