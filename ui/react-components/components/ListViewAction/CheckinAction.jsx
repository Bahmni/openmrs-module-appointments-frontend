import CustomPopup from "../CustomPopup/CustomPopup";
import {checkinPopup} from "./ListViewAction.module.scss";
import useListViewAction from "./useListViewAction";
import React from "react";

export default function CheckinAction() {
  const {show, handleClose} = useListViewAction();

  const currentTime = () => {
    const today = new Date();
    return `${today.getHours()}:${today.getMinutes()}`
  };

  const content = () => {
    return (
      <>
        {show &&
        <>
          <p>Are you sure, you want to mark appointment as CheckedIn?</p>
          <p>
            <b>Check in time:</b>
            <sup>*</sup>
            <input type="time" defaultValue={currentTime()}/>
          </p>
          <p>
            <button onClick={() => handleClose()}>Yes</button>
            <button onClick={() => handleClose()}>No</button>
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
