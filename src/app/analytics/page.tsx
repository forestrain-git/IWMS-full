/**
 * 数据分析页面
 * 数据统计和分析报表
 */

"use client";

import * as React from "react";
import { BarChart3, TrendingUp, Download, Calendar } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/business/PageHeader";
import { StatCard } from "@/components/business/StatCard";
import { TrendChart } from "@/components/business/TrendChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateTrendData, generateMultiTrendData } from "@/lib/mockGenerators";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  // 生成图表数据
  const volumeTrend = React.useMemo(() => generateTrendData(30), []);
  const comparisonData = React.useMemo(() => generateMultiTrendData(3, 30), []);

  return (
    <MainLayout>
      <PageHeader
        title="数据分析"
        description="业务数据统计和分析报表"
        actions={
          <>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              选择日期
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              导出报表
            </Button>
          </>
        }
      />

      {/* 统计卡片 */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="本月处理量"
          value={3847.5}
          unit="吨"
          trend={12.5}
          trendLabel="较上月"
          icon={BarChart3}
          color="blue"
        />
        <StatCard
          title="平均日处理量"
          value={128.3}
          unit="吨"
          trend={5.2}
          trendLabel="较上月"
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="资源回收率"
          value={78.5}
          unit="%"
          trend={3.8}
          trendLabel="较上月"
          icon={BarChart3}
          color="amber"
        />
        <StatCard
          title="碳减排量"
          value={156.8}
          unit="吨"
          trend={15.3}
          trendLabel="较上月"
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* 数据图表 */}
      <Tabs defaultValue="volume" className="space-y-4">
        <TabsList>
          <TabsTrigger value="volume">处理量分析</TabsTrigger>
          <TabsTrigger value="category">分类统计</TabsTrigger>
          <TabsTrigger value="efficiency">效率分析</TabsTrigger>
          <TabsTrigger value="comparison">对比分析</TabsTrigger>
        </TabsList>

        <TabsContent value="volume" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>30天处理量趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart
                data={volumeTrend}
                trendType="positive"
                height={300}
                showTooltip
                showAxis
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>垃圾分类统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  { label: "厨余垃圾", value: 1542, color: "bg-green-500" },
                  { label: "可回收物", value: 1236, color: "bg-blue-500" },
                  { label: "有害垃圾", value: 128, color: "bg-red-500" },
                  { label: "其他垃圾", value: 941, color: "bg-slate-500" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border p-4 text-center"
                  >
                    <div
                      className={cn(
                        "mx-auto mb-2 h-4 w-4 rounded-full",
                        item.color
                      )}
                    />
                    <div className="text-2xl font-bold">
                      {item.value}
                      <span className="ml-1 text-sm font-normal text-muted-foreground">
                        吨
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-4">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-amber-100 p-4 dark:bg-amber-900">
                <BarChart3 className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium">该模块正在开发中...</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                效率分析将提供设备利用率、人员效率、任务完成率等分析报表。
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>对比分析</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart
                data={comparisonData[0]}
                trendType="positive"
                height={300}
                showTooltip
                showAxis
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
