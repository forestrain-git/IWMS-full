"use client";
import React from "react";
import { useSettings } from "../hooks/useSettings";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const configSchema = z.object({
  platformName: z.string().min(1),
  logoUrl: z.string().optional(),
  loginBgUrl: z.string().optional(),
  themeMode: z.enum(["light","dark","auto"]),
  themeColor: z.enum(["blue","green","purple"]),
  mapCenter: z.tuple([z.number(), z.number()]),
  mapZoom: z.number().min(1).max(20),
  alertSound: z.boolean(),
  alertDuration: z.number().min(1),
  refreshInterval: z.number().min(10),
});

type ConfigForm = z.infer<typeof configSchema>;

export function SystemConfig() {
  const { systemConfig, updateSystemConfig } = useSettings();

  const form = useForm<ConfigForm>({
    resolver: zodResolver(configSchema),
    defaultValues: systemConfig as any,
  });

  const onSubmit = (data: ConfigForm) => {
    updateSystemConfig(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>平台名称</Label>
          <Input {...form.register("platformName")} />
        </div>
        <div>
          <Label>Logo URL</Label>
          <Input {...form.register("logoUrl")} />
        </div>
        <div>
          <Label>登录页背景</Label>
          <Input {...form.register("loginBgUrl")} />
        </div>
        <div>
          <Label>默认中心点 (lng,lat)</Label>
          <div className="flex gap-2">
            <Input type="number" step="0.0001" {...form.register("mapCenter.0", { valueAsNumber: true })} />
            <Input type="number" step="0.0001" {...form.register("mapCenter.1", { valueAsNumber: true })} />
          </div>
        </div>
        <div>
          <Label>默认缩放</Label>
          <Input type="number" {...form.register("mapZoom", { valueAsNumber: true })} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>主题模式</Label>
          <Select
            value={form.watch("themeMode")}
            onValueChange={v => form.setValue("themeMode", v as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="light">浅色</SelectItem>
                <SelectItem value="dark">深色</SelectItem>
                <SelectItem value="auto">自动</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>主题色</Label>
          <Select
            value={form.watch("themeColor")}
            onValueChange={v => form.setValue("themeColor", v as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="blue">蓝</SelectItem>
                <SelectItem value="green">绿</SelectItem>
                <SelectItem value="purple">紫</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={form.watch("alertSound")}
            onCheckedChange={v => form.setValue("alertSound", v)}
          />
          <span>告警声音</span>
        </div>
        <div>
          <Label>弹窗持续 (秒)</Label>
          <Input type="number" {...form.register("alertDuration", { valueAsNumber: true })} />
        </div>
        <div>
          <Label>刷新间隔 (秒)</Label>
          <Input type="number" {...form.register("refreshInterval", { valueAsNumber: true })} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">保存配置</Button>
      </div>
    </form>
  );
}
