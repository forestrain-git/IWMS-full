/**
 * 测试告警页面 - 简化版
 */

"use client";

import * as React from "react";
import { useMockDataStore } from "@/store";

export default function TestAlertsPage() {
  const alerts = useMockDataStore((state) => state.alerts);

  if (!alerts || alerts.length === 0) {
    return (
      <div style={{ backgroundColor: 'white', padding: '20px', color: 'black' }}>
        <h1>加载中或没有数据</h1>
        <p>请检查Mock数据</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '20px' }}>
      <h1 style={{ color: 'black', marginBottom: '20px' }}>告警测试页面</h1>
      <p style={{ color: 'black', marginBottom: '20px' }}>共有 {alerts.length} 条告警</p>

      {alerts.slice(0, 3).map((alert) => (
        <div
          key={alert.id}
          style={{
            backgroundColor: '#f0f0f0',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        >
          <h3 style={{ color: 'black', marginBottom: '5px' }}>{alert.stationName}</h3>
          <p style={{ color: 'black', fontSize: '14px' }}>{alert.message}</p>
          <p style={{ color: 'gray', fontSize: '12px', marginTop: '5px' }}>
            状态: {alert.status} | 等级: {alert.level}
          </p>
        </div>
      ))}
    </div>
  );
}
