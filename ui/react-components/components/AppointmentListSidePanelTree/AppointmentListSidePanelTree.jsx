import React, { useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdAddBox,
  MdIndeterminateCheckBox,
  MdAdd,
  MdRemove
} from "react-icons/md";
import "./AppointmentListSidePanelTree.module.scss";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import classNames from "classnames";

const AppointmentListSidePanelTree = props => {
  const { nodes, getChecked, intl } = props;
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  const icons = {
    check: <MdCheckBox className={classNames("mdCheckBox")} />,
    uncheck: <MdCheckBoxOutlineBlank className={classNames("mdCheckBoxOutlineBlank")} />,
    halfCheck: <MdIndeterminateCheckBox className={classNames("mdIndeterminateCheckBox")} />,
    expandClose: <MdAdd />,
    expandOpen: <MdRemove />,
    expandAll: <MdAddBox />,
    collapseAll: (
      <MdIndeterminateCheckBox className={classNames("mdIndeterminateCheckBox")} />
    ),
    parentClose: "",
    parentOpen: "",
    leaf: ""
  };

  return (
    <div data-testid="tree">
      <CheckboxTree
        nodes={nodes || []}
        checked={checked}
        expanded={expanded}
        onCheck={checked => {
          getChecked(checked);
          setChecked(checked);
        }}
        onExpand={expanded => {
          setExpanded(expanded);
        }}
        icons={icons}
      />
    </div>
  );
};

AppointmentListSidePanelTree.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(AppointmentListSidePanelTree);
