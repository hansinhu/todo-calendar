
export const formateDate = (dataList: Array<object>) => {
  return dataList.map((item, i) => ({
    ...item,
    _index: i
  }))
}
