export const getDataArray = numOfData => {
  let data = [];
  for (let i = 0; i < numOfData; i++) {
    data.push({
      id: i + 1,
      label: i,
    });
  }
  return data;
};
