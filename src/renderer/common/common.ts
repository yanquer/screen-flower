
export const getRandomStr = () => {
    const nowDate = new Date()
        .getTime()
        .toString()
        .substring(5, 15);
    const randomStr = Math.random()
        .toString(36)
        .substring(2);
    // console.log(nowDate)
    // console.log(randomStr)
    return `${nowDate}${randomStr}`;
}
