
// todo: 开发环境下显式设置true, 避免服务端/客户端结果不一致导致无法渲染
export const isFrontDev = false // process?.env?.NODE_ENV_BROWSER === 'yes'
console.debug("===== isFrontDev: ", isFrontDev)
