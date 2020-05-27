import {useState} from "react";

export default function useListViewAction() {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  return [show, handleClose]
}
