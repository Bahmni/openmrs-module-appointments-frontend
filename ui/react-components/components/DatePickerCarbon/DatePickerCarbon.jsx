import React from "react";
import PropTypes from "prop-types";
import {DatePicker, DatePickerInput} from "carbon-components-react";
import moment from "moment";
const DatePickerCarbon = props => {

    const {onChange, defaultDate} = props;
    return (
        <div data-testid="datePicker">
            <DatePicker datePickerType={"single"} onChange={onChange} minDate={moment().format("MM-DD-YYYY")} value={defaultDate || moment().toDate()}>
                <DatePickerInput
                    id={"Appointment Date"}
                    placeholder={"mm/dd/yyyy"}
                    labelText={"Appointment date"}
                    size={"md"}
                    style={{width:"250px"}}
                />
            </DatePicker>
        </div>

    );
};

DatePickerCarbon.propTypes = {
    onChange: PropTypes.func
};

export default DatePickerCarbon;
