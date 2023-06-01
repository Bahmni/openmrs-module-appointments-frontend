import React, {useEffect} from "react";
import classNames from 'classnames';
import {alertContainer} from "./popup.module.scss"
import { InlineNotification } from "carbon-components-react";

const Popup = props => {
    const {showMessage = false, action, title} = props
    const [ isAlertVisible, setIsAlertVisible ] = React.useState(false);
    useEffect(()=>{
        if(action){
            action();
        }
        if(showMessage){
            setIsAlertVisible(true);
            setTimeout(() => {
                setIsAlertVisible(false);
            }, 5000);
        }
    },[showMessage])

    return (
        <div>
            {isAlertVisible && <div className={classNames(alertContainer)}>
                <InlineNotification
                    kind={"success"}
                    title={title}
                    lowContrast={true}/>
            </div>
            }
        </div>
);
};

export default Popup;
