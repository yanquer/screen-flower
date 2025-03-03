const resolvePackagePath = require('resolve-package-path');
const {join} = require("path");
const childProcess = require("child_process");

const execSyncWithOutput = (input) => {
  console.log("execSyncWithOutput: ", input);
  return childProcess.execSync(input).toString().trim()
}

const signMacThird = () => {

  const platform = process.platform;
  if (platform !== "darwin") {
    return
  }

  const nodeMacPermissions = join(
      resolvePackagePath('node-mac-permissions', __dirname),
      ".."
  )
  // node_modules/node-mac-permissions/build/Release/permissions.node
  const permissionExec = join(nodeMacPermissions, "build", "Release", "permissions.node")
  // childProcess.execSync(`codesign --force --deep --sign "${permissionExec}" && codesign -v ${permissionExec}`)

  let alreadySign = false
  try {
    alreadySign = execSyncWithOutput(`codesign -v ${permissionExec}`) === ""
  } catch (e) {
    alreadySign = false;
  }

  if (alreadySign){
    console.log(`Already Signed ${permissionExec}`)
    return
  }

  console.log("如果有设置访问钥匙串密码, 请在弹出的密码访问框中输入密码")
  // todo: 怎么自动配置证书? 不同机器上注意配置不一样的签名文件(复制钥匙串上开发者证书名字即可)
  // childProcess.execSync(`codesign --sign "5FN86XQL4Y" "${permissionExec}"`)
  execSyncWithOutput(`codesign --deep --force --sign "5FN86XQL4Y" "${permissionExec}"`)

  return () => execSyncWithOutput(`codesign --remove-signature "${permissionExec}"`)
}

signMacThird()
