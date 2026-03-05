@echo off
echo 正在修复Next.js问题...
echo.

:: 1. 停止所有Node进程
echo 1. 停止Node进程...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM next.exe 2>nul
ping -n 3 127.0.0.1 >nul

:: 2. 删除缓存
echo 2. 删除缓存目录...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

:: 3. 重新安装依赖
echo 3. 重新安装依赖...
call npm install

:: 4. 等待安装完成
echo 4. 等待安装完成...
ping -n 5 127.0.0.1 >nul

:: 5. 重新启动开发服务器
echo 5. 启动开发服务器...
start cmd /k "npm run dev"

echo.
echo ✅ 修复完成！请在2-3分钟后访问 http://localhost:3000/alerts
echo.
pause
