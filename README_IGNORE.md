# 不要提交到 Git 的大文件/目录说明

此文件说明本仓库根目录下建议忽略（已在 `.gitignore` 中添加）的那些大文件或目录，以及如果不小心已将它们提交到仓库，如何将其从索引中移除。

常见大文件/目录（已忽略）
- `node_modules/`：依赖安装目录，体积很大，使用 `package.json` 恢复依赖。
- `.next/`：Next.js 构建输出，不应提交。
- `dist/` 或 `build/`：构建产物。
- `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`：锁文件（通常应提交以保证一致性），但如果你不想提交它们可以忽略；请谨慎处理。
- `public/uploads/`, `media/`：上传的用户文件或大媒体资源，建议使用对象存储或单独仓库管理。
- `*.sqlite`, `*.db`：本地数据库文件。
- `.env*`：本地环境变量文件，含敏感信息，不应提交。

快速清理（将已跟踪的大文件从 Git 索引中移除，但保留工作区文件）

1. 更新 `.gitignore`（已完成）并确认要移除的路径。
2. 运行下面命令将这些文件从 git 索引中移除（示例）：

```bash
# 从索引中移除 node_modules（不删除工作区文件）
git rm -r --cached node_modules

# 从索引中移除构建输出
git rm -r --cached .next dist build

# 从索引中移除上传文件目录
git rm -r --cached public/uploads media

# 提交变更
git add .gitignore README_IGNORE.md
git commit -m "chore: update .gitignore and remove large files from index"
git push
```

注意：如果大文件已经进入了 Git 历史并占用了仓库体积，考虑使用 `git filter-repo`（推荐）或 `git filter-branch` / BFG Repo-Cleaner 清理历史。清理历史是破坏性操作，会重写提交记录，请先备份并通知协作者。

示例（使用 BFG，快速替换删除某文件类型）：

```bash
# 安装 bfg（本地或全局），然后
# 删除所有 *.zip 文件并清理历史
bfg --delete-files "*.zip"
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

如果你需要，我可以：
- 帮你把 `public/uploads/`、`media/` 或 `package-lock.json` 加入 `.gitignore`（已添加示例）并提交。
- 帮你生成一份更详细的迁移/清理脚本以安全从历史中移除大文件（会说明风险与备份步骤）。
