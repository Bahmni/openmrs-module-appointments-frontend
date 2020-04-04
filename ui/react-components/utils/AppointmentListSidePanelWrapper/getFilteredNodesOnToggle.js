const getFilteredNodesOnToggle = (transformedTreeData,filteredCheckedData) => {
  const filteredNodesList = transformedTreeData
    .filter(
      element =>
        filteredCheckedData.some(checked => element.value === checked) ||
        (element.children &&
          element.children.some(subElement =>
            filteredCheckedData.some(checked => subElement.value === checked)
          ))
    )
    .map(element => {
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
    });
  return filteredNodesList;
};

export default getFilteredNodesOnToggle;
