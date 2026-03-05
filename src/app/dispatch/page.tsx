"use client";

import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/business/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DispatchPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="调度中心"
          description="智能调度与路径优化"
        />

        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground py-12">
              <p>调度中心模块正在开发中</p>
              <p className="text-sm mt-2">车辆调度、路径优化、任务分配等功能即将上线</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
