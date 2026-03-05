"use client";

import * as React from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/business/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMockDataStore } from "@/store";
import type { Alert, AlertStatus } from "@/types";
import { ALERT_LEVEL_CONFIG } from "@/lib/constants";

export default function AlertsPage() {
  const alerts = useMockDataStore((state) => state.alerts);
  const [selectedAlert, setSelectedAlert] = React.useState<Alert | null>(null);

  if (!alerts || alerts.length === 0) {
    return (
      <MainLayout>
        <div className="p-6">
          <h1>正在加载数据...</h1>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="告警中心"
          description="智能告警管理与实时监控"
        />

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">告警列表 ({alerts.length})</h2>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      style={{
                        backgroundColor: ALERT_LEVEL_CONFIG[alert.level]?.color || "#999"
                      }}
                    >
                      {ALERT_LEVEL_CONFIG[alert.level]?.label || alert.level}
                    </Badge>
                    <span>{alert.stationName}</span>
                    <span className="text-muted-foreground">{alert.message}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
