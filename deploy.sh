#!/usr/bin/env sh
# 檢查有沒有 dist 資料夾，如果有的話，就移除
DIR="./dist"
if [ -d "$DIR" ]; then
  yes | rm -r ./dist
fi

# 發生錯誤時停止腳本
set -e

# 產出靜態網站，即 dist 資料夾
npm run build

# 進到 dist 資料夾
cd dist

# 放置 .nojekyll 以繞過 GitHub Page 的 Jekyll 處理
echo > .nojekyll

# 如果你是自訂網域的話，請將下面註解拿掉，並且將 www.example.com 改成你的網域
# echo 'www.example.com' > CNAME

git init
git checkout -B main
git add -A
git commit -m 'deploy'

# 如果你要部署在 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# 如果你要部署在 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:chrisc0210/react-training-2025.git main:gh-pages

cd -