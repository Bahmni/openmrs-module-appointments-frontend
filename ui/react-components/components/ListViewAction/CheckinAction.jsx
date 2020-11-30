import CustomPopup from "../CustomPopup/CustomPopup";
import {checkinPopup} from "./ListViewAction.module.scss";
import usePopupAction from "./usePopupAction";
import {useIntl} from "react-intl";
import React from "react";

export default function CheckinAction() {
  const {show, handleClose} = usePopupAction();
  const intl = useIntl();

  const currentTime = () => {
    const today = new Date();
    return `${today.getHours()}:${today.getMinutes()}`
  };

  const content = () => {
    return (
      <>
        {show &&
        <>
          <p>{intl.formatMessage({id: "APPOINTMENT_STATUS_CHANGE_CONFIRM_MESSAGE"}, {toStatus: "CheckedIn"})}</p>
          <p>
            <b>{`${intl.formatMessage({id: "APPOINTMENT_CHECKIN_TIME_KEY", defaultMessage: "Check in time"})}:`}</b>
            <sup>*</sup>
            <input type="time" defaultValue={currentTime()}/>
          </p>
          <p>
            <button onClick={() => handleClose()}>{intl.formatMessage({id: "YES_KEY", defaultMessage: "Yes"})}</button>
            <button onClick={() => handleClose()}>{intl.formatMessage({id: "NO_KEY", defaultMessage: "No"})}</button>
          </p>
        </>}
      </>);
  };
  {
    return show &&
      (
        <CustomPopup open={true} popupContent={content()} closeOnDocumentClick
                     closeOnEscape style={checkinPopup}>
        </CustomPopup>
      );
  }
};
