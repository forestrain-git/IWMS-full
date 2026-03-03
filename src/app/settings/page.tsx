/**
 * 系统设置页面
 * 系统配置和用户设置
 */

"use client";

"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/business/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// placeholder components; will implement next
import { UserManagement } from "./components/UserManagement";
import { RolePermission } from "./components/RolePermission";
import { SystemConfig } from "./components/SystemConfig";
import { OperationLog } from "./components/OperationLog";
import { PersonalSetting } from "./components/PersonalSetting";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <MainLayout>
      <PageHeader title="系统设置" description="平台基础配置与权限管理" />
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="users">用户管理</TabsTrigger>
            <TabsTrigger value="roles">角色权限</TabsTrigger>
            <TabsTrigger value="system">系统配置</TabsTrigger>
            <TabsTrigger value="logs">操作日志</TabsTrigger>
            <TabsTrigger value="personal">个人设置</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          <TabsContent value="roles">
            <RolePermission />
          </TabsContent>
          <TabsContent value="system">
            <SystemConfig />
          </TabsContent>
          <TabsContent value="logs">
            <OperationLog />
          </TabsContent>
          <TabsContent value="personal">
            <PersonalSetting />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

