"use client";
import React, { useState } from "react";
import { useSettings } from "../hooks/useSettings";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RoleType } from "../types/settings";

const modules = [
  "dashboard",
  "stations",
  "monitor",
  "dispatch",
  "ai-center",
  "alerts",
  "analytics",
  "settings",
];

export function RolePermission() {
  const { rolePerms, setRolePermission } = useSettings();

  const toggleModule = (role: RoleType, mod: string) => {
    const rp = rolePerms.find(r => r.role === role);
    if (!rp) return;
    const has = rp.modules.includes(mod);
    const newList = has ? rp.modules.filter(m => m !== mod) : [...rp.modules, mod];
    setRolePermission(role, { modules: newList });
  };

  const changeScope = (role: RoleType, scope: string) => {
    setRolePermission(role, { dataScope: scope as any });
  };

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>角色 \ 模块</TableHead>
            {modules.map(m => (
              <TableHead key={m} className="capitalize">{m}</TableHead>
            ))}
            <TableHead>数据范围</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rolePerms.map(rp => (
            <TableRow key={rp.role}>
              <TableCell>{rp.role}</TableCell>
              {modules.map(m => (
                <TableCell key={m} className="text-center">
                  <Checkbox
                    checked={rp.modules.includes(m)}
                    onCheckedChange={() => toggleModule(rp.role, m)}
                  />
                </TableCell>
              ))}
              <TableCell>
                <Select
                  value={rp.dataScope}
                  onValueChange={v => changeScope(rp.role, v)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="region">区域</SelectItem>
                      <SelectItem value="self">本人</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
