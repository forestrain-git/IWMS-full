"use client";
import React from "react";
import { useSettings } from "../hooks/useSettings";
import { useTheme } from "@/hooks/useTheme";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const schema = z.object({
  name: z.string().min(1, "请输入姓名"),
  email: z.string().email("邮箱格式不正确"),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function PersonalSetting() {
  const { personalSettings, updatePersonalSettings } = useSettings();
  const { theme, setTheme } = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: personalSettings.name,
      email: personalSettings.email,
      phone: personalSettings.phone,
    },
  });

  const onSubmit = (data: FormData) => {
    updatePersonalSettings({
      ...personalSettings,
      name: data.name,
      email: data.email,
      phone: data.phone,
    });
  };

  return (
    <div className="p-4 max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">姓名</label>
          <Input {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block mb-1">邮箱</label>
          <Input {...register("email")} />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block mb-1">电话</label>
          <Input {...register("phone")} />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={theme === "dark"}
            onCheckedChange={val => setTheme(val ? "dark" : "light")}
          />
          <span>深色模式</span>
        </div>
        <Button type="submit">保存</Button>
      </form>
    </div>
  );
}
