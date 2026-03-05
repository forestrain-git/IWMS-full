"use client";

import React from "react";

export default function AlertsSimple() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#111827', color: 'white', minHeight: '100vh' }}>
      <h1>告警中心 - 简化版</h1>
      <p>服务器运行正常！</p>
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#1f2937', borderRadius: '8px' }}>
        <h2>✅ 测试成功</h2>
        <p>如果看到这个页面，说明Next.js服务器正常工作。</p>
        <p>原始告警页面的问题可能是：</p>
        <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
          <li>Framer Motion动画库冲突</li>
          <li>Three.js 3D渲染问题</li>
          <li>Mock数据加载失败</li>
        </ul>
      </div>
    </div>
  );
}
