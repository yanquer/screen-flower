export const objCopy = (obj: any): any => {
  const objStr = JSON.stringify(obj)
  return JSON.stringify(objStr)
}

export const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test'
}

export const createBlobByBuffer = (data: Buffer) => {
  if (!data) return undefined
  const blob = new Blob([data], { type: 'audio/mp4' })
  if (blob.size === 0) return undefined
  return blob
}


