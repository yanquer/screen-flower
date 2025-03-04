
// rst-parser
const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '..', '..');

const getLatest = () => {
  const readmePath = path.join(projectDir, 'CHANGELOG.rst');
  const readmeContent = fs.readFileSync(readmePath, 'utf8');

  // 顶级标题第一个
  const versionRegex = /\s*(\d+\.\d+\.\d+)\n=+/;
  const versionMatch = readmeContent.match(versionRegex);

  if (!versionMatch) {
    console.error('无法从 readme.rst 中提取版本号');
    process.exit(1);
  }

  return versionMatch[1];
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




