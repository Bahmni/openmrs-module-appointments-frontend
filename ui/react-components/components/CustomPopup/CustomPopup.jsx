import Popup from "reactjs-popup";
import React from "react";
import PropTypes from "prop-types";
import classNames from 'classnames';

const CustomPopup = props => {

    const {triggerComponent, popupContent, closeOnDocumentClick, closeOnEscape, open, style} = props;

    return (
        <Popup className={classNames(style, 'popup-overlay')}
            trigger={triggerComponent}
            closeOnDocumentClick={closeOnDocumentClick}
            closeOnEscape={closeOnEscape}
            open={open}
            modal>
            {
                close => (React.cloneElement(popupContent, {close: close}))
            }
        </Popup>
    );
};

CustomPopup.propTypes = {
    closeOnDocumentClick: PropTypes.bool,
    closeOnEscape: PropTypes.bool,
    open:PropTypes.bool,
    popupContent: PropTypes.object.isRequired,
    triggerComponent: PropTypes.object,
    style: PropTypes.string
};

export default CustomPopup;
