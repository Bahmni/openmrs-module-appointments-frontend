import CustomPopup from "../CustomPopup/CustomPopup";
import {popup} from "./ListViewAction.module.scss";
import React from "react";
import useListViewAction from "./useListViewAction";
import {useIntl} from "react-intl";

export default function CancelAction() {
  const {show, handleClose} = useListViewAction();
  const intl = useIntl();

  function content() {
    return (
      <>
        <p>{intl.formatMessage({id: "APPOINTMENT_STATUS_CHANGE_CONFIRM_MESSAGE"}, {toStatus: "Cancelled"})}</p>

        <button onClick={() => handleClose()}>{intl.formatMessage({id: "YES_KEY", defaultMessage: "Yes"})}</button>
        <button onClick={() => handleClose()}>{intl.formatMessage({id: "NO_KEY", defaultMessage: "No"})}</button>

      </>
    );
  }

  {
    return show &&
      <CustomPopup open={true} popupContent={content()} closeOnDocumentClick
                   closeOnEscape style={popup}/>
  }
};
