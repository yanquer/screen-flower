export const objCopy = (obj: any): any => {
  const objStr = JSON.stringify(obj)
  return JSON.stringify(objStr)
}
