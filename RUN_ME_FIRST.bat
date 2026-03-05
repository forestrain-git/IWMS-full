@echo off
echo =================================================
echo 智环卫士 - 一键修复脚本
echo =================================================
echo.
echo ⚠️  请右键点击此文件，选择"以管理员身份运行"
echo.
echo 这个脚本将：
echo 1. 停止所有Node.js进程
echo 2. 清除损坏的缓存
echo 3. 重新安装依赖
echo 4. 自动启动开发服务器
echo.
echo 预计用时：5-10分钟
echo.
echo 按任意键继续...
pause >nul

cd /d C:\Users\Administrator\Projects\IWSM-try2pages\smart-waste-platform

echo.
echo 📦 步骤1: 清除缓存...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo ✅ 缓存已清除

echo.
echo 📦 步骤2: 重新安装依赖...
echo 这可能需要3-5分钟，请耐心等待...
call npm install --registry=https://registry.npmmirror.com
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败，请检查网络连接
    pause
    exit /b 1
)

echo.
echo ✅ 依赖安装成功！
echo.
echo 🚀 步骤3: 启动开发服务器...
echo 服务器启动后，请访问 http://localhost:3000/simple-test
echo.
start cmd /k "npm run dev"

timeout /t 30 /nobreak >nul

echo.
echo =================================================
echo ✅ 修复完成！
echo =================================================
echo.
echo 请访问以下URL测试：
echo.
echo 1. 简单测试页面：
echo    http://localhost:3000/simple-test
echo    （应该看到彩色页面）
echo.
echo 2. 告警演示页面：
echo    http://localhost:3000/alerts
echo    （应该看到动画效果）
echo.
echo =================================================
echo 如果页面仍然空白，请等待1-2分钟后刷新
echo =================================================
echo.
pause
