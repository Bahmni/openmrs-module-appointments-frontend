import React from "react";
import { PropTypes } from "prop-types";
import { injectIntl } from "react-intl";
import { Dropdown } from "carbon-components-react";

const DropdownCarbon = (props) => {
    const {
        options,
        placeholder,
        onChange,
        isDisabled,
        selectedValue,
        id
    } = props;
    return (
        <div
            data-testid="select dropdown"
        >
            <Dropdown
                id={id}
                items={options}
                onChange={onChange}
                titleText={placeholder}
                disabled={isDisabled}
                label={"Choose an option"}
                selectedItem={selectedValue}
            />
        </div>
    );
};

export default injectIntl(DropdownCarbon);

DropdownCarbon.propTypes = {
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    selectedValue: PropTypes.string,
    isDisabled: PropTypes.bool
};
