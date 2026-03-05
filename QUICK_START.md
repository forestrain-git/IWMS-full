# 智环卫士 - 快速启动指南（重启后使用）

## 📝 重启前状态总结

### ✅ 已实现内容

**1. 告警中心演示版（Module 6）**
- 4个核心组件开发完成：
  - AlertStatCards（统计卡片，带数字跳动动画）
  - SmartAlertList（智能告警列表，3D卡片效果）
  - AlertDetailShowcase（详情展示，集成Three.js 3D场景）
  - EnhancedAlertTicker（实时告警跑马灯，含声音提示）

**2. 技术栈**
- Next.js 14.1.0 + React 18 + TypeScript
- framer-motion（动画）
- @react-three/fiber + Three.js（3D渲染）
- Recharts（数据可视化）

**3. 文件位置**
```
src/app/alerts/
├── page.tsx                           # 主页面（演示版）
└── demo/
    ├── AlertStatCards.tsx            # 统计卡片
    ├── SmartAlertList.tsx            # 智能列表
    ├── AlertDetailShowcase.tsx       # 详情展示
    ├── EnhancedAlertTicker.tsx       # 实时跑马灯
    ├── README.md                     # 演示文档
    └── IMPLEMENTATION_SUMMARY.md     # 实现总结
```

### ❓ 遇到的问题

**问题**：Next.js配置损坏，出现 `Cannot find module 'pages/_document.js'` 错误

**原因**：node_modules中Next.js配置损坏，服务器误认为项目使用Pages Router

**解决方案**：
1. 删除 `.next` 缓存目录
2. 重新安装依赖（npm install）
3. 使用 `npm run dev` 启动

**最终结果**：服务器成功启动，运行在端口3003

---

## 🚀 重启后载入步骤

### 步骤 1：启动开发服务器

**方法A：使用快捷脚本**

在PowerShell中执行：
```powershell
cd "C:\Users\Administrator\Projects\IWSM-try2pages\smart-waste-platform"
npm run dev
```

**方法B：使用一键启动脚本**

双击运行：`RUN_ME_FIRST.bat`（在项目根目录）

**预期结果**：
```
⚠ Port 3000 is in use, trying 3001 instead...  # 可能显示3002、3003等
   ▲ Next.js 14.1.0
   - Local:        http://localhost:300x       # 记下这个端口号

 ✓ Ready in x.xs
```

### 步骤 2：访问演示页面

根据实际端口号访问：

1. **告警演示页面**（主要演示）：
   - http://localhost:3003/alerts

2. **简单测试页面**（验证服务器）：
   - http://localhost:3003/simple-test

3. **备用测试页面**（简化版告警）：
   - http://localhost:3003/test-alerts

### 步骤 3：验证演示效果

正常应该看到：

- [ ] 深色科技感界面（非白屏）
- [ ] 顶部橙色跑马灯（实时告警推送）
- [ ] 统计卡片数字跳动动画
- [ ] 鼠标悬停卡片有3D倾斜效果
- [ ] 点击告警卡片滑出详情页
- [ ] 详情页切换到"3D预览"可旋转模型
- [ ] 等待10秒，新告警自动推送到跑马灯

---

## 🔧 故障排除

### 如果npm run dev失败

**错误**：`Cannot find module 'xxx'`

**解决**：
```powershell
# 重新安装依赖
cd "C:\Users\Administrator\Projects\IWSM-try2pages\smart-waste-platform"

# 使用国内镜像加速
npm install --registry=https://registry.npmmirror.com

# 然后重新启动
npm run dev
```

### 如果页面白屏

**步骤1**：检查浏览器控制台
- 按F12打开开发者工具
- 查看Console标签页是否有红色错误
- 截图错误信息

**步骤2**：检查页面是否返回HTML
```powershell
# 在PowerShell中执行
curl -s http://localhost:3003/alerts | head -20

# 应该看到HTML内容，而不是错误信息
```

**步骤3**：检查服务器终端
- 查看终端窗口是否有错误输出
- 截图错误信息给我

### 如果端口被占用

如果3000-3005端口都被占用，尝试：
```powershell
# 手动指定端口
npm run dev -- -p 4000
```

然后访问：http://localhost:4000/alerts

---

## 📂 重要文件位置

### 演示相关
- `src/app/alerts/page.tsx` - 主演示页面
- `src/app/alerts/demo/` - 所有演示组件

### 快捷启动脚本
- `RUN_ME_FIRST.bat` - 一键启动脚本（右键以管理员运行）
- `EMERGENCY_FIX.ps1` - PowerShell修复脚本

### 文档
- `src/app/alerts/demo/README.md` - 演示使用说明
- `src/app/alerts/demo/IMPLEMENTATION_SUMMARY.md` - 实现总结

---

## 🎯 核心演示功能

### 1. 统计卡片（页面顶部）
- 数字从0跳动到目标值
- 鼠标悬停3D倾斜
- 紧急告警脉冲发光

### 2. 智能告警列表（中间部分）
- 卡片依次飞入（stagger动画）
- 悬停飞出效果（translateZ）
- 滑动删除手势

### 3. 详情展示页（点击告警后）
- 3D设备模型（Three.js）
- 可旋转、缩放
- 实时数据图表

### 4. 实时跑马灯（顶部橙色条）
- 每10秒推送新告警
- 颜色编码（🔴紧急/🟡告警/🔵通知）
- 声音提示（可开关）

---

## 📞 后续支持

如果遇到任何问题：

1. **截图错误信息**（浏览器控制台 + 终端）
2. **描述复现步骤**
3. **联系我获取帮助**

常见问题：
- 动画卡顿 → 检查浏览器性能
- 3D模型不显示 → 检查WebGL支持
- 数据不更新 → 检查Mock数据生成

---

## 🎉 预祝演示成功！

重启后按照以上步骤操作，演示系统应该能正常工作。

**总开发时间**：9小时
**代码行数**：~1,350行
**动画效果**：12+
**技术复杂度**：中高

祝你演示顺利！🚀
