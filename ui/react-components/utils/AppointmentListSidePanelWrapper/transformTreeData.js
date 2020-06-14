import React from "react";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const transformTreeData = (arr) => {
  return arr.map((ele) => {
    let children;
    if (ele.serviceTypes.length !== 0) {
      children = transformChild(ele.serviceTypes);
    }
    const newNode = {
      label: ele.name,
      value: ele.uuid,
      ...ele,
    };
    if (ele.color)
      newNode["icon"] = ele.color && <FontAwesomeIcon
        style={{ color: ele.color }}
        icon={faSquare}
      ></FontAwesomeIcon>;
    if (ele.serviceTypes.length != 0) newNode["children"] = children;
    return newNode;
  });
};

const transformChild = (arr) => {
  return arr.map((ele) => {
    const newNode = {
      label: ele.name + " " + `[${ele.duration} min]`,
      value: ele.uuid,
      ...ele,
    };
    if (ele.color)
      newNode["icon"] = ele.color && <FontAwesomeIcon
        style={{ color: ele.color }}
        icon={faSquare}
      ></FontAwesomeIcon>;;

    return newNode;
  });
};

export default transformTreeData;
