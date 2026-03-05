#!/usr/bin/env pwsh

# ==============================================================================
# 智环卫士 - Next.js 紧急修复脚本 (PowerShell)
# 用于修复 "Cannot find module 'pages/_document.js'" 错误
# ==============================================================================

Write-Host "==========================================" -ForegroundColor Yellow
Write-Host "智环卫士 - 紧急修复脚本" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host ""

# 设置项目路径
$PROJECT_PATH = "C:\Users\Administrator\Projects\IWSM-try2pages\smart-waste-platform"

# 1. 停止所有Node.js进程
Write-Host "步骤 1: 停止Node.js进程..." -ForegroundColor Cyan
try {
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Stop-Process -Name next -Force -ErrorAction SilentlyContinue
    Write-Host "✅ 已停止所有Node.js进程" -ForegroundColor Green
} catch {
    Write-Host "⚠️  没有Node.js进程在运行" -ForegroundColor Yellow
}

# 等待2秒
Start-Sleep -Seconds 2

# 2. 进入项目目录
Write-Host ""
Write-Host "步骤 2: 进入项目目录..." -ForegroundColor Cyan
Set-Location -Path $PROJECT_PATH
Write-Host "✅ 当前目录: $(Get-Location)" -ForegroundColor Green

# 3. 删除缓存和依赖（遇到错误继续）
Write-Host ""
Write-Host "步骤 3: 删除缓存和node_modules..." -ForegroundColor Cyan

try {
    if (Test-Path ".next") {
        Remove-Item -Path ".next" -Recurse -Force -ErrorAction Continue
        Write-Host "✅ 已删除 .next 目录" -ForegroundColor Green
    } else {
        Write-Host "⚠️  .next 目录不存在" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  无法删除 .next 目录: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    if (Test-Path "node_modules") {
        Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction Continue
        Write-Host "✅ 已删除 node_modules 目录" -ForegroundColor Green
    } else {
        Write-Host "⚠️  node_modules 目录不存在" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  无法删除 node_modules 目录: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    if (Test-Path "package-lock.json") {
        Remove-Item -Path "package-lock.json" -Force -ErrorAction Continue
        Write-Host "✅ 已删除 package-lock.json" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  无法删除 package-lock.json" -ForegroundColor Red
}

# 等待3秒确保文件解锁
Start-Sleep -Seconds 3

# 4. 重新安装依赖
Write-Host ""
Write-Host "步骤 4: 重新安装依赖..." -ForegroundColor Cyan
Write-Host "这可能需要 3-5 分钟，请耐心等待..." -ForegroundColor Yellow

# 检查npm或yarn是否可用
$npmExists = Get-Command npm -ErrorAction SilentlyContinue
$yarnExists = Get-Command yarn -ErrorAction SilentlyContinue
cnpmExists = Get-Command cnpm -ErrorAction SilentlyContinue

if ($cnpmExists) {
    Write-Host "使用 cnpm 安装（速度更快）..." -ForegroundColor Green
    cnpm install
} elseif ($yarnExists) {
    Write-Host "使用 yarn 安装..." -ForegroundColor Green
    yarn install
} elseif ($npmExists) {
    Write-Host "使用 npm 安装..." -ForegroundColor Green
    npm install
} else {
    Write-Host "❌ 错误: 找不到npm、yarn或cnpm命令" -ForegroundColor Red
    Write-Host "请检查Node.js是否正确安装" -ForegroundColor Red
    exit 1
}

# 检查安装是否成功
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ 依赖安装失败，请检查网络连接或npm配置" -ForegroundColor Red
    Write-Host "尝试运行: npm config set registry https://registry.npmjs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ 依赖安装成功！" -ForegroundColor Green

# 5. 启动开发服务器
Write-Host ""
Write-Host "步骤 5: 启动开发服务器..." -ForegroundColor Cyan

# 使用Start-Process在后台启动，避免阻塞
Write-Host "开发服务器正在后台启动..." -ForegroundColor Yellow
Write-Host "请等待30秒，然后访问 http://localhost:3000/simple-test" -ForegroundColor Yellow
Write-Host ""

$process = Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory $PROJECT_PATH -PassThru

# 等待30秒
for ($i = 30; $i -gt 0; $i--) {
    Write-Host -NoNewline "`r等待 $i 秒..."
    Start-Sleep -Seconds 1
}

# 6. 打开浏览器
Write-Host ""
Write-Host "✅ 服务器应该已经启动" -ForegroundColor Green
Write-Host ""
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host "修复完成！" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "请访问以下URL测试：" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 简单测试页面:" -ForegroundColor White
Write-Host "   http://localhost:3000/simple-test" -ForegroundColor Blue
Write-Host "   （应该看到彩色页面）" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 告警演示页面:" -ForegroundColor White
Write-Host "   http://localhost:3000/alerts" -ForegroundColor Blue
Write-Host "   （应该看到动画效果）" -ForegroundColor Gray
Write-Host ""
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "如果页面仍然显示错误：" -ForegroundColor Red
Write-Host "1. 等待1-2分钟再刷新" -ForegroundColor Yellow
Write-Host "2. 检查终端窗口是否有错误信息" -ForegroundColor Yellow
Write-Host "3. 如果npm install失败，尝试: npm config set registry https://registry.npmmirror.com" -ForegroundColor Yellow
Write-Host ""
Write-Host "按任意键退出此脚本..." -ForegroundColor Cyan

# 暂停脚本，保持PowerShell窗口打开
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
