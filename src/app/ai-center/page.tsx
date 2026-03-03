/**
 * AI识别中心页面
 * AI图像识别和分析
 */

"use client";

import * as React from "react";
import { ScanEye, Camera, AlertCircle, CheckCircle2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/business/PageHeader";
import { StatCard } from "@/components/business/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMockDataStore } from "@/store";
import { cn, formatDateTime } from "@/lib/utils";

export default function AICenterPage() {
  const aiRecognitions = useMockDataStore((state) => state.aiRecognitions);

  // 计算统计
  const stats = React.useMemo(() => {
    const total = aiRecognitions.length;
    const alerts = aiRecognitions.filter((r) => r.isAlert).length;
    const highConfidence = aiRecognitions.filter((r) => r.confidence >= 90).length;
    const avgConfidence =
      total > 0
        ? aiRecognitions.reduce((sum, r) => sum + r.confidence, 0) / total
        : 0;

    return { total, alerts, highConfidence, avgConfidence };
  }, [aiRecognitions]);

  return (
    <MainLayout>
      <PageHeader
        title="AI识别中心"
        description="智能图像识别与行为分析"
      />

      {/* 统计卡片 */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="总识别数"
          value={stats.total}
          icon={ScanEye}
          color="blue"
        />
        <StatCard
          title="告警识别"
          value={stats.alerts}
          icon={AlertCircle}
          color="red"
        />
        <StatCard
          title="高置信度"
          value={stats.highConfidence}
          trend={stats.total > 0 ? (stats.highConfidence / stats.total) * 100 : 0}
          trendLabel="占比"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="平均置信度"
          value={stats.avgConfidence.toFixed(1)}
          unit="%"
          icon={Camera}
          color="purple"
        />
      </div>

      {/* 识别记录列表 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {aiRecognitions.map((recognition) => (
          <RecognitionCard key={recognition.id} recognition={recognition} />
        ))}
      </div>

      {/* 开发中提示 */}
      <Card className="mt-6 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-purple-100 p-4 dark:bg-purple-900">
            <ScanEye className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium">该模块正在开发中...</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            AI识别中心将提供垃圾分类识别、违规行为检测、火情预警等功能。
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}

/**
 * 识别记录卡片
 */
function RecognitionCard({
  recognition,
}: {
  recognition: import("@/types").AIRecognition;
}) {
  const typeLabels: Record<string, string> = {
    waste_type: "垃圾分类",
    illegal_dumping: "违规投放",
    fire_smoke: "火情烟雾",
    person: "人员检测",
    vehicle: "车辆识别",
  };

  const typeColors: Record<string, string> = {
    waste_type: "bg-blue-500",
    illegal_dumping: "bg-red-500",
    fire_smoke: "bg-orange-500",
    person: "bg-green-500",
    vehicle: "bg-purple-500",
  };

  return (
    <Card className="overflow-hidden">
      {/* 图片区域 */}
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="h-12 w-12 text-slate-300 dark:text-slate-600" />
        </div>
        {recognition.isAlert && (
          <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-600">
            告警
          </Badge>
        )}
        <div className="absolute right-2 top-2 rounded-md bg-black/50 px-2 py-1 text-xs text-white">
          {recognition.confidence.toFixed(0)}%
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={cn("h-2 w-2 rounded-full", typeColors[recognition.type])}
            />
            <span className="font-medium">{typeLabels[recognition.type]}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDateTime(recognition.timestamp, "relative")}
          </span>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {recognition.description}
        </p>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{recognition.stationName}</span>
          <span>置信度 {recognition.confidence.toFixed(1)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
