/**
 * 告警中心页面
 * 告警管理和处理
 */

"use client";

import * as React from "react";
import { Bell, CheckCircle2, Clock, AlertTriangle, Filter } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/business/PageHeader";
import { StatCard } from "@/components/business/StatCard";
import { StatusTag } from "@/components/business/StatusTag";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";
import { useMockDataStore, useAlertStore } from "@/store";
import { AlertLevel, AlertStatus } from "@/types";
import { ALERT_LEVEL_CONFIG, ALERT_STATUS_CONFIG } from "@/lib/constants";
import { cn, formatDateTime } from "@/lib/utils";

export default function AlertsPage() {
  const alerts = useMockDataStore((state) => state.alerts);
  const { unreadCount, markAllAsRead } = useAlertStore();
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [levelFilter, setLevelFilter] = React.useState<string>("all");

  // 计算统计
  const stats = React.useMemo(() => {
    const total = alerts.length;
    const pending = alerts.filter((a) => a.status === "pending").length;
    const processing = alerts.filter((a) => a.status === "processing").length;
    const resolved = alerts.filter((a) => a.status === "resolved").length;
    const critical = alerts.filter((a) => a.level === "critical").length;

    return { total, pending, processing, resolved, critical };
  }, [alerts]);

  // 过滤告警
  const filteredAlerts = React.useMemo(() => {
    return alerts.filter((alert) => {
      const matchesStatus =
        statusFilter === "all" || alert.status === statusFilter;
      const matchesLevel =
        levelFilter === "all" || alert.level === levelFilter;
      return matchesStatus && matchesLevel;
    });
  }, [alerts, statusFilter, levelFilter]);

  // 样式配置
  const statsContainerStyles = React.useMemo(() => ({
    marginBottom: SPACING.xl,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: SPACING.md,
  }), []);

  const filterCardStyles = React.useMemo(() => ({
    marginBottom: SPACING.xl,
  }), []);

  const filterContentStyles = React.useMemo(() => ({
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    gap: SPACING.md,
    padding: `${SPACING.md} 0`,
  }), []);

  const filterLabelStyles = React.useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  }), []);

  const filterIconStyles = React.useMemo(() => ({
    width: '16px',
    height: '16px',
    color: COLORS.neutral[500],
  }), []);

  const filterTextStyles = React.useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  }), []);

  const selectTriggerStyles = React.useMemo(() => ({
    width: '140px',
  }), []);

  const tabsContainerStyles = React.useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.md,
  }), []);

  const tabsListStyles = React.useMemo(() => ({
    display: 'flex',
    gap: SPACING.sm,
  }), []);

  const tabTriggerStyles = React.useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    position: 'relative' as const,
  }), []);

  const badgeStyles = React.useMemo(() => ({
    marginLeft: SPACING.sm,
  }), []);

  const tabContentStyles = React.useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.md,
  }), []);

  return (
    <MainLayout>
      <PageHeader
        title="告警中心"
        description="告警管理和处理跟踪"
        actions={
          <Button 
            variant="outline" 
            onClick={markAllAsRead}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: SPACING.sm,
            }}
          >
            <CheckCircle2 style={{ width: '16px', height: '16px' }} />
            全部标记已读
          </Button>
        }
      />

      {/* 统计卡片 */}
      <div style={statsContainerStyles}>
        <StatCard
          title="全部告警"
          value={stats.total}
          icon={Bell}
          color="blue"
        />
        <StatCard
          title="待处理"
          value={stats.pending}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="处理中"
          value={stats.processing}
          icon={AlertTriangle}
          color="purple"
        />
        <StatCard
          title="已解决"
          value={stats.resolved}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="紧急告警"
          value={stats.critical}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* 筛选器 */}
      <Card style={filterCardStyles}>
        <CardContent style={filterContentStyles}>
          <div style={filterLabelStyles}>
            <Filter style={filterIconStyles} />
            <span style={filterTextStyles}>筛选:</span>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger style={selectTriggerStyles}>
              <SelectValue placeholder="告警状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="pending">待处理</SelectItem>
              <SelectItem value="processing">处理中</SelectItem>
              <SelectItem value="resolved">已解决</SelectItem>
            </SelectContent>
          </Select>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger style={selectTriggerStyles}>
              <SelectValue placeholder="告警等级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部等级</SelectItem>
              <SelectItem value="critical">紧急</SelectItem>
              <SelectItem value="high">高</SelectItem>
              <SelectItem value="medium">中</SelectItem>
              <SelectItem value="low">低</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* 告警列表 */}
      <Tabs defaultValue="all" style={tabsContainerStyles}>
        <TabsList style={tabsListStyles}>
          <TabsTrigger value="all" style={tabTriggerStyles}>
            全部
            <Badge variant="secondary" style={badgeStyles}>
              {alerts.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" style={tabTriggerStyles}>
            待处理
            <Badge variant="secondary" style={badgeStyles}>
              {alerts.filter((a) => a.status === "pending").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="critical" style={tabTriggerStyles}>
            紧急
            <Badge variant="destructive" style={badgeStyles}>
              {alerts.filter((a) => a.level === "critical").length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" style={tabContentStyles}>
          <AlertList alerts={filteredAlerts} />
        </TabsContent>
        <TabsContent value="pending" style={tabContentStyles}>
          <AlertList
            alerts={filteredAlerts.filter((a) => a.status === "pending")}
          />
        </TabsContent>
        <TabsContent value="critical" style={tabContentStyles}>
          <AlertList
            alerts={filteredAlerts.filter((a) => a.level === "critical")}
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}

/**
 * 告警列表组件
 */
function AlertList({
  alerts,
}: {
  alerts: import("@/types").Alert[];
}) {
  const typeLabels: Record<string, string> = {
    fullness: "满溢告警",
    offline: "设备离线",
    fault: "设备故障",
    illegal: "违规投放",
    fire: "火情预警",
  };

  // 样式配置
  const emptyCardStyles = React.useMemo(() => ({
    border: '2px dashed',
    borderColor: COLORS.neutral[300],
  }), []);

  const emptyContentStyles = React.useMemo(() => ({
    padding: `${SPACING.xl} 0`,
    textAlign: 'center' as const,
    color: COLORS.neutral[500],
  }), []);

  const listContainerStyles = React.useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.md,
  }), []);

  const alertCardStyles = React.useMemo(() => (alert: any) => ({
    transition: `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
    '&:hover': {
      backgroundColor: `${COLORS.neutral[100]}50`,
    },
    ...(alert.level === "critical" && {
      borderColor: COLORS.semantic.error,
    })
  }), []);

  const alertContentStyles = React.useMemo(() => ({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: SPACING.md,
  }), []);

  const alertInfoStyles = React.useMemo(() => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: SPACING.md,
  }), []);

  const levelIndicatorStyles = React.useMemo(() => (alert: any) => {
    const colorMap: Record<string, string> = {
      critical: COLORS.semantic.error,
      high: COLORS.status.warning,
      medium: COLORS.primary[500],
      low: COLORS.neutral[500],
    };
    
    return {
      marginTop: SPACING.xs,
      width: '12px',
      height: '12px',
      flexShrink: 0,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: colorMap[alert.level] || COLORS.neutral[500],
    };
  }, []);

  const alertDetailsStyles = React.useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.xs,
  }), []);

  const alertHeaderStyles = React.useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  }), []);

  const alertTitleStyles = React.useMemo(() => ({
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  }), []);

  const alertMessageStyles = React.useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.neutral[500],
  }), []);

  const alertMetaStyles = React.useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.neutral[500],
  }), []);

  const alertActionsStyles = React.useMemo(() => ({
    display: 'flex',
    gap: SPACING.sm,
  }), []);

  if (alerts.length === 0) {
    return (
      <Card style={emptyCardStyles}>
        <CardContent style={emptyContentStyles}>
          暂无告警记录
        </CardContent>
      </Card>
    );
  }

  return (
    <div style={listContainerStyles}>
      {alerts.map((alert) => (
        <Card
          key={alert.id}
          style={alertCardStyles(alert)}
        >
          <CardContent style={alertContentStyles}>
            <div style={alertInfoStyles}>
              {/* 等级指示 */}
              <div style={levelIndicatorStyles(alert)} />

              <div style={alertDetailsStyles}>
                <div style={alertHeaderStyles}>
                  <span style={alertTitleStyles}>{typeLabels[alert.type]}</span>
                  <Badge variant="outline">
                    {ALERT_LEVEL_CONFIG[alert.level].label}
                  </Badge>
                  <span
                    style={{
                      fontSize: TYPOGRAPHY.fontSize.xs,
                      color: ALERT_STATUS_CONFIG[alert.status].color
                    }}
                  >
                    {ALERT_STATUS_CONFIG[alert.status].label}
                  </span>
                </div>

                <p style={alertMessageStyles}>
                  {alert.message}
                </p>

                <div style={alertMetaStyles}>
                  <span>{alert.stationName}</span>
                  <span>{formatDateTime(alert.timestamp, "relative")}</span>
                  {alert.handler && <span>处理人: {alert.handler}</span>}
                </div>
              </div>
            </div>

            <div style={alertActionsStyles}>
              {alert.status === "pending" && (
                <Button size="sm">处理</Button>
              )}
              <Button variant="ghost" size="sm">
                详情
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
