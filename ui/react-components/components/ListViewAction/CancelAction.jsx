import CustomPopup from "../CustomPopup/CustomPopup";
import {popup} from "./ListViewAction.module.scss";
import React from "react";
import useListViewAction from "./ListViewAction";

export default function CancelAction() {
  const [show, handleClose] = useListViewAction();

  function content() {
    return (
      <>
        <p>Are you sure, you want to mark appointment as Cancelled?</p>

        <button onClick={() => handleClose()}>Yes</button>
        <button onClick={() => handleClose()}>No</button>

      </>
    );
  }

  {
    return show &&
      <CustomPopup open={true} popupContent={content()} closeOnDocumentClick
                   closeOnEscape style={popup}/>
  }
};
