import React from "react";
import { MdStop } from "react-icons/md";

const transformTreeData = arr => {
  return arr.map(ele => {
    let children;
    if (ele.serviceTypes.length !== 0) {
      children = transformChild(ele.serviceTypes);
    }
    const newNode = {
      label: ele.name,
      value: ele.uuid,
      ...ele
    };
    if (ele.color)
      newNode["icon"] = ele.color && <MdStop style={{ color: ele.color }} />;
    if (ele.serviceTypes.length != 0) newNode["children"] = children;
    return newNode;
  });
};

const transformChild = arr => {
  return arr.map(ele => {
    const newNode = {
      label: ele.name + " " + `[${ele.duration} min]`,
      value: ele.uuid,
      ...ele
    };
    if (ele.color)
      newNode["icon"] = ele.color && <MdStop style={{ color: ele.color }} />;

    return newNode;
  });
};

export default transformTreeData;
