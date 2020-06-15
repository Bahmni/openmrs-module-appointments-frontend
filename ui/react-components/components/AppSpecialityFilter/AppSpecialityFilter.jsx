import React, { useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { faCheck, faUncheck, faExpand, faClose } from "./AppSpecialityFilter.module.scss";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import classNames from "classnames";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faCheckSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AppSpecialityFilter = (props) => {
  const { nodes, getChecked, intl } = props;
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  const icons = {
    check: (
      <FontAwesomeIcon
        className={classNames(faCheck)}
        icon={faCheckSquare}
      ></FontAwesomeIcon>
    ),
    uncheck: (
      <FontAwesomeIcon
        className={classNames(faUncheck)}
        icon={faSquare}
      ></FontAwesomeIcon>
    ),
    halfCheck: (
      <FontAwesomeIcon
        className={classNames(faCheck)}
        icon={faMinusSquare}
      ></FontAwesomeIcon>
    ),
    expandClose: (<span className={classNames(faExpand)}>+</span>),
    expandOpen: (<span className={classNames(faClose)}>-</span>),
    expandAll: "",
    collapseAll: (
      <FontAwesomeIcon
        className={classNames(faCheck)}
        icon={faCheckSquare}
      ></FontAwesomeIcon>
    ),
    parentClose: "",
    parentOpen: "",
    leaf: "",
  };

  return (
    <div data-testid="tree">
      <CheckboxTree
        nodes={nodes || []}
        checked={checked}
        expanded={expanded}
        onCheck={(checked) => {
          getChecked(checked);
          setChecked(checked);
        }}
        onExpand={(expanded) => {
          setExpanded(expanded);
        }}
        icons={icons}
      />
    </div>
  );
};

AppSpecialityFilter.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(AppSpecialityFilter);
