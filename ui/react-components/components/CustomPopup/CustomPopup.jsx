import Popup from "reactjs-popup";
import React from "react";
import PropTypes from "prop-types";

const CustomPopup = props => {

    const {triggerComponent, popupContent} = props;

    const contentStyle = {
        width: "600px",
    };

    return (
        <Popup
            trigger={triggerComponent}
            contentStyle={contentStyle}
            closeOnDocumentClick
            closeOnEscape
            modal>
            {
                close => (React.cloneElement(popupContent, {close: close}))
            }
        </Popup>
    );
};

CustomPopup.propTypes = {
    triggerComponent: PropTypes.object.isRequired,
    popupContent: PropTypes.object.isRequired
};

export default CustomPopup;
