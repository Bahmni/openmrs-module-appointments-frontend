import React, {useEffect, useRef} from "react";
import classNames from 'classnames';
import {alertContainer} from "./popup.module.scss"
import { InlineNotification } from "carbon-components-react";

const Notifications = props => {
    const {showMessage = false, title, onClose, messageDuration=5000} = props
    const ref = useRef(null)
    useEffect(()=>{
        if(showMessage){
            if(ref.current){
                clearTimeout(ref.current)
            }
            ref.current = setTimeout(() => {
                onClose();
            }, messageDuration);
        }
    },[showMessage])

    return (
        <div>
            {showMessage && <div className={classNames(alertContainer)}>
                <InlineNotification
                    kind={"success"}
                    title={title}
                    lowContrast={true}
                />
            </div>
            }
        </div>
);
};

export default Notifications;
