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
const AppointmentListSidePanelTree = props => {
  const { nodes, getChecked, intl } = props;
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  const icons = {
    check: <MdCheckBox className="mdCheckBox" />,
    uncheck: <MdCheckBoxOutlineBlank className="mdCheckBoxOutlineBlank" />,
    halfCheck: <MdIndeterminateCheckBox className="mdIndeterminateCheckBox" />,
    expandClose: <MdAdd />,
    expandOpen: <MdRemove />,
    expandAll: <MdAddBox />,
    collapseAll: (
      <MdIndeterminateCheckBox className="mdIndeterminateCheckBox" />
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
