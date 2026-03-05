"use client";

import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/business/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useMockDataStore } from "@/store";

export default function StationsPage() {
  const stations = useMockDataStore((state) => state.stations);

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="站点管理"
          description="垃圾站点的监控与管理"
        />

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">站点列表 ({stations.length})</h2>
            <div className="space-y-2">
              {stations.slice(0, 10).map((station) => (
                <div
                  key={station.id}
                  className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{station.name}</span>
                    <span className="text-muted-foreground text-sm">{station.address}</span>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    station.status === 'online'
                      ? 'bg-green-100 text-green-700'
                      : station.status === 'offline'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {station.status === 'online' ? '在线' : station.status === 'offline' ? '离线' : '告警'}
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
