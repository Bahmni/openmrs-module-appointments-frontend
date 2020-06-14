import React, { useState } from "react";
import AppointmentListSidePanelSearch from "../AppointmentListSidePanelSearch/AppointmentListSidePanelSearch";
import AppSpecialityFilter from "../AppSpecialityFilter/AppSpecialityFilter";
import Label from "../Label/Label";
import ToggleButton from "../ToggleButton/ToggleButton";
import { showSelectedContainer } from "./AppointmentListSidePanelWrapper.module.scss";
import TransformTreeData from "../../utils/AppointmentListSidePanelWrapper/transformTreeData";
import GetFilteredNodesOnToggle from "../../utils/AppointmentListSidePanelWrapper/getFilteredNodesOnToggle";
import GetFilteredNodesOnSearch from "../../utils/AppointmentListSidePanelWrapper/getFilteredNodesOnSearch";
import classNames from "classnames";
import { useEffect } from "react";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";

const AppointmentListSidePanelWrapper = props => {
  const { intl, serviceData } = props;
  const [flagForToggleButton, setFlagForToggleButton] = useState(false);
  const [filteredCheckedData, setFilteredCheckedData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [searchText, setSearchText] = useState(null);


  const transformedTreeData = serviceData && TransformTreeData(serviceData);

  useEffect(() => {
    setTreeData(transformedTreeData);
  }, [toggleHandler]);

  const getCheckedNodeHandler = checkedNodesItemList => {
    setFilteredCheckedData(checkedNodesItemList);
    if (flagForToggleButton === true) {
      const filteredNodesList = GetFilteredNodesOnToggle(
        transformedTreeData,
        checkedNodesItemList
      );
      return filteredNodesList ? setTreeData(filteredNodesList) : null;
    }
  };

  const toggleHandler = () => {
    setFlagForToggleButton(!flagForToggleButton);
    if (flagForToggleButton === false) {
      const filteredNodesList = GetFilteredNodesOnToggle(
        transformedTreeData,
        filteredCheckedData
      );
      setTreeData(filteredNodesList);
    } else {
      setTreeData(transformedTreeData);
      setSearchText(null);
    }
  };

  const searchHandler = e => {
    setSearchText(e.target.value === "" ? null : e.target.value);
    const searchFilteredNodesList = GetFilteredNodesOnSearch(
      transformedTreeData,
      e.target.value
    );
    setTreeData(searchFilteredNodesList);
  };

  const clearSearchTextHandler = e => {
    setSearchText((e.target.value = null));
    setTreeData(transformedTreeData);
  };

  return (
    <div className={classNames("AppointmentListSidePanelContainer")}>
      <AppointmentListSidePanelSearch
        onChange={searchHandler}
        disabledInputSearch={flagForToggleButton}
        value={searchText}
        onClearText={clearSearchTextHandler}
      />
      <div className={classNames(showSelectedContainer)}>
        <Label
          forInput="show-selected"
          translationKey="SHOW_SELECTED_LABEL"
          defaultValue="Show selected"
        />
        <ToggleButton
          checked={flagForToggleButton}
          handleToggle={toggleHandler}
        />
      </div>
      <AppSpecialityFilter
        nodes={treeData}
        getChecked={getCheckedNodeHandler}
      />
    </div>
  );
};

AppointmentListSidePanelWrapper.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(AppointmentListSidePanelWrapper);
