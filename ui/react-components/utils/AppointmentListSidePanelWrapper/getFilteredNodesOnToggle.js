const hasMatchingElementOrChildren = (element, filteredCheckedData) => {
  return (
    filteredCheckedData.some(checked => element.value === checked) ||
    (element.children &&
      element.children.some(subElement =>
        filteredCheckedData.some(checked => subElement.value === checked)
      )))
}

const returnMatchingElementOrChildren = (element, filteredCheckedData) => {
  const newfilteredNodesList = Object.assign(
    {},
    element,
    element.children
      ? {
        children: element.children.filter(subElement =>
          filteredCheckedData.some(
            checked => subElement.value === checked
          )
        )
      }
      : null
  );
  return newfilteredNodesList;
}


const getFilteredNodesOnToggle = (transformedTreeData, filteredCheckedData) => {
  const filteredNodesList = transformedTreeData
    .filter(
      element => hasMatchingElementOrChildren(element, filteredCheckedData)
    )
    .map(element => returnMatchingElementOrChildren(element, filteredCheckedData));
  return filteredNodesList;
};

export default getFilteredNodesOnToggle;
