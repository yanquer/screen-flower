
// rst-parser
const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '..', '..');

const getLatest = () => {
  // 读取 readme.rst 文件
  const readmePath = path.join(projectDir, 'CHANGELOG.rst');
  const readmeContent = fs.readFileSync(readmePath, 'utf8');

  // 解析 .rst 文件
  // const parsedRst = rst.parse(readmeContent);

  // 假设版本号在 .rst 文件的某个标题或段落中
  // 这里假设版本号在类似 "Version: 1.2.3" 的段落中
  const versionRegex = /\s*(\d+\.\d+\.\d+)\n=+/;
  const versionMatch = readmeContent.match(versionRegex);

  if (!versionMatch) {
    console.error('无法从 readme.rst 中提取版本号');
    process.exit(1);
  }

  const newVersion = versionMatch[1];

  return newVersion;
}


const updateVersion = () => {
  const newVersion = getLatest();
  if (newVersion){
    const packageJsonPath = path.join(projectDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (packageJson.version === newVersion) {
      return
    }
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`成功更新 package.json 中的版本号为: ${newVersion}`);
  }
}

updateVersion()




