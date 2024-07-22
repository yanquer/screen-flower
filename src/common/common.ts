export const objCopy = (obj: any): any => {
  const objStr = JSON.stringify(obj)
  return JSON.stringify(objStr)
}

export const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test'
}
