const hasMatchingElementOrChildren = (element, searchText) => {
  return (
    element.label
      .trim()
      .toLowerCase()
      .includes(searchText.toLowerCase()) ||
    (element.children &&
      element.children.some(subElement =>
        subElement.label
          .trim()
          .toLowerCase()
          .includes(searchText.toLowerCase())
      ))
  )
}

const returnMatchingElementOrChildren = (ele, searchText) => {
  const filteredList = Object.assign(
    {},
    ele,
    ele.label
      .trim()
      .toLowerCase()
      .includes(searchText.toLowerCase())
      ? ele
      : ele.children
        ? {
          children: ele.children.filter(subElement =>
            subElement.label
              .trim()
              .toLowerCase()
              .includes(searchText.toLowerCase())
          )
        }
        : null
  );
  return filteredList;
}



const getFilteredNodesOnSearch = (transformedTreeData, searchText) => {
  const searchFilteredNodesList = transformedTreeData
    .filter(element => hasMatchingElementOrChildren(element, searchText))
    .map(ele => returnMatchingElementOrChildren(ele, searchText));
  return searchFilteredNodesList;
};

export default getFilteredNodesOnSearch;
