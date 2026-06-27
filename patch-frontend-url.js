const fs = require('fs');
const files = [
  'E:/桌面/新建文件夹/local-noauth-build/resources/app/dist/assets/index-Djj7DpyR.js',
  'E:/桌面/新建文件夹/wechat-shop-automation-rebuild/app/dist/assets/index-Djj7DpyR.js',
];
for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  text = text.replaceAll('https://ai.t8star.cn/v1', 'https://local.invalid/blocked-ai');
  text = text.replaceAll('https://ai.t8star.cn', 'https://local.invalid/blocked-ai');
  fs.writeFileSync(file, text, 'utf8');
  console.log(file, 'length', fs.statSync(file).size, 'ai.t8star?', text.includes('ai.t8star'));
}
