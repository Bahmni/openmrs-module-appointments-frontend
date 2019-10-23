import Popup from "reactjs-popup";
import React from "react";
import PropTypes from "prop-types";
import classNames from 'classnames';
import {customPopup} from './CustomPopup.module.scss';

const CustomPopup = props => {

    const {triggerComponent, popupContent, closeOnDocumentClick, closeOnEscape, open} = props;

    return (
        <Popup className={classNames(customPopup, 'popup-overlay')}
            trigger={triggerComponent}
            closeOnDocumentClick={closeOnDocumentClick && closeOnDocumentClick}
            closeOnEscape={closeOnEscape && closeOnEscape}
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
    triggerComponent: PropTypes.object
};

export default CustomPopup;
