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

export const getRandomStr = () => {
  const nowDate = new Date()
      .getTime()
      .toString()
      .substring(5, 15);
  const randomStr = Math.random()
      .toString(36)
      .substring(2);
  // Logger.info(nowDate)
  // Logger.info(randomStr)
  return `${nowDate}${randomStr}`;
}

export const getCurrentTime = () => {
  const d_t = new Date();

  let year = d_t.getFullYear();
  let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
  let day = ("0" + d_t.getDate()).slice(-2);
  let hour = d_t.getHours();
  let minute = d_t.getMinutes();
  let seconds = d_t.getSeconds();

  // prints date & time in YYYY-MM-DD HH:MM:SS format
  return (year + "-" + month + "-" + day + " " + hour + "_" + minute + "_" + seconds);
}

export const asyncSleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}



