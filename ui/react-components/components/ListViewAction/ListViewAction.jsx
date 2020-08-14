import CustomPopup from "../CustomPopup/CustomPopup";
import {popup} from "./ListViewAction.module.scss";
import {useIntl} from "react-intl";
import React from "react";
import usePopupAction from "./usePopupAction";

export default function ListViewAction({status = "Completed"}) {
  const {show, handleClose} = usePopupAction();
  const intl = useIntl();

  function content() {
    return (
      <>
        <p>{intl.formatMessage({id: "APPOINTMENT_STATUS_CHANGE_CONFIRM_MESSAGE"}, {toStatus: status})}</p>
        <button onClick={() => handleClose()}>{intl.formatMessage({id: "YES_KEY", defaultMessage: "Yes"})}</button>
        <button onClick={() => handleClose()}>{intl.formatMessage({id: "NO_KEY", defaultMessage: "No"})}</button>
      </>
    )
  }

  {
    return show &&
      <CustomPopup open={true} popupContent={content()} closeOnDocumentClick closeOnEscape style={popup}/>
  }
};
