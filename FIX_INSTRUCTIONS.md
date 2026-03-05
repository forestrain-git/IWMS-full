# 修复Next.js配置问题

## ⚠️ 问题诊断

错误：`Cannot find module 'pages/_document.js'`

这说明Next.js正在尝试使用 **Pages Router**，但我们的项目使用的是 **App Router**。

## 🔧 修复步骤

### 方法A：快速修复（推荐）

在Windows PowerShell中执行：

```powershell
# 1. 停止所有Node进程
Stop-Process -Name node -Force -ErrorAction SilentlyContinue

# 2. 删除缓存和依赖（必须在smart-waste-platform目录下）
cd C:\Users\Administrator\Projects\IWSM-try2pages\smart-waste-platform
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules" -Recurse -Force

# 3. 使用cnpm加速重新安装
cnpm install

# 4. 等待安装完成（约3-5分钟）
# 5. 启动开发服务器
npm run dev

# 6. 访问
Start-Process "http://localhost:3000/alerts"
```

### 方法B：手动检查

如果问题仍然存在：

1. 检查是否存在 `pages` 目录：
```powershell
Test-Path "C:\Users\Administrator\Projects\IWSM-try2pages\smart-waste-platform\pages"
```

如果存在，请删除它：
```powershell
Remove-Item -Path "pages" -Recurse -Force
```

2. 确保只有 `app` 目录：
```powershell
ls "C:\Users\Administrator\Projects\IWSM-try2pages\smart-waste-platform\"
```

3. 检查next.config.js：
```javascript
// 确保没有奇怪的配置
const nextConfig = {
  reactStrictMode: true,
  // 不要添加 experimental.appDir
}
```

## 📝 备用方案：简化版本

如果修复失败，可以使用备份页面：

访问：http://localhost:3000/test-alerts

这是一个简化版本的告警页面，不依赖复杂组件。

## ✅ 验证成功

修复成功后：
- http://localhost:3000/simple-test 应该显示正常
- http://localhost:3000/alerts 应该显示告警页面
- 不应该再出现 "pages/_document.js" 错误

