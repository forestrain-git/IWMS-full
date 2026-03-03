/**
 * @file StationDetailDrawer.tsx
 * @description 站点详情抽屉组件
 * @module 模块2:站点管理
 */

"use client";

import * as React from "react";
import { X, Star, MapPin, Phone, User, Calendar, TrendingUp, Package, Camera, AlertTriangle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Station } from "../types/station";

interface StationDetailDrawerProps {
  /** 站点信息 */
  station: Station | null;
  /** 是否打开 */
  isOpen: boolean;
  /** 关闭回调 */
  onClose: () => void;
}

export function StationDetailDrawer({ station, isOpen, onClose }: StationDetailDrawerProps) {
  const [activeTab, setActiveTab] = React.useState("overview");

  if (!station) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[500px] overflow-y-auto">
        <SheetHeader className="border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">{station.name}</SheetTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Star className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="monitor">监控</TabsTrigger>
              <TabsTrigger value="collection">收运</TabsTrigger>
            </TabsList>

            {/* 概览标签页 */}
            <TabsContent value="overview" className="space-y-4">
              {/* 基本信息 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">基本信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">站点编码</label>
                      <div className="font-medium">{station.code}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">站点类型</label>
                      <div className="font-medium">智能回收站</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">负责人</label>
                      <div className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {station.managerName}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">联系电话</label>
                      <div className="font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {station.managerPhone}
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <label className="text-sm text-gray-500">站点地址</label>
                    <div className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {station.address}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 今日统计 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    今日统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {station.dailyVolume?.toFixed(1) || "0.0"}
                      </div>
                      <div className="text-sm text-gray-600">收运量(吨)</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {station.onlineDeviceCount}/{station.deviceCount}
                      </div>
                      <div className="text-sm text-gray-600">在线设备</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 二维码 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">站点二维码</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-2" />
                      <div className="text-sm">二维码</div>
                      <div className="text-xs mt-1">{station.id}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 监控标签页 */}
            <TabsContent value="monitor" className="space-y-4">
              {/* 视频占位 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    实时监控
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <Camera className="h-12 w-12 mx-auto mb-2" />
                      <div>视频预留</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI事件列表 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    AI事件
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <div>
                            <div className="font-medium text-sm">满溢告警</div>
                            <div className="text-xs text-gray-500">
                              {new Date(Date.now() - i * 3600000).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">处理中</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 收运标签页 */}
            <TabsContent value="collection" className="space-y-4">
              {/* 日历 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    本月收运统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 text-center text-xs">
                    {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                      <div key={day} className="font-medium text-gray-600 p-2">{day}</div>
                    ))}
                    {Array.from({ length: 35 }, (_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "p-2 rounded border",
                          i % 7 === 0 || i % 7 === 6 ? "bg-gray-50" : "",
                          Math.random() > 0.7 ? "bg-green-100 border-green-300" : "bg-white border-gray-200"
                        )}
                      >
                        <div className={Math.random() > 0.7 ? "text-green-700" : "text-gray-400"}>
                          {Math.floor(Math.random() * 5) + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 最近记录 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">最近收运记录</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <div>
                            <div className="font-medium text-sm">收运完成</div>
                            <div className="text-xs text-gray-500">
                              {new Date(Date.now() - i * 7200000).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {(Math.random() * 3 + 1).toFixed(1)} 吨
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default StationDetailDrawer;
