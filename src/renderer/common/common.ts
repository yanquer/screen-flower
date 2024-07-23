
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

export const asyncSleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}
