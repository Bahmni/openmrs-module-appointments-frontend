import CustomPopup from '../components/CustomPopup/CustomPopup';
import React, {useState} from 'react';
import {checkinPopup, popup} from '../components/ListViewAction/ListViewAction.module.scss'

export default {title: 'List View Actions'};

function useListViewAction() {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false)

  return [show, handleClose]
}

export const checkin = () => {
  const [show, handleClose] = useListViewAction();

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
            <input type="time" value={currentTime()}/>
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

export const missed = () => {
  const [show, handleClose] = useListViewAction();

  function content() {
    return (
      <>
        <p>Are you sure, you want to mark appointment as Missed?</p>

        <button onClick={() => console.log("Clicked yes")}>Yes</button>
        <button onClick={() => handleClose()}>No</button>

      </>
    );
  }

  {
    return show &&
      (
        <CustomPopup open={true} popupContent={content()} closeOnDocumentClick
                     closeOnEscape style={popup}>
        </CustomPopup>
      )
  }
};

export const complete = () => {
  const [show, handleClose] = useListViewAction();

  function content() {
    return (
      <>
        <p>Are you sure, you want to mark appointment as Completed?</p>
        <button onClick={() => console.log("Clicked Yes")}>Yes</button>
        <button onClick={() => handleClose()}>No</button>
      </>
    )
  }

  {
    return show &&
      <CustomPopup open={true} popupContent={content()} closeOnDocumentClick closeOnEscape style={popup}/>
  }
};

export const cancel = () => {
  const [show, handleClose] = useListViewAction();

  function content() {
    return (
      <>
        <p>Are you sure, you want to mark appointment as Cancelled?</p>

        <button onClick={() => console.log("Clicked Yes")}>Yes</button>
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
