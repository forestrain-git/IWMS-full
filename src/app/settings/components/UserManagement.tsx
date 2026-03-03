"use client";

import React, { useState, useMemo } from "react";
import { useSettings } from "../hooks/useSettings";
import { ColumnDef, getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User, RoleType } from "../types/settings";
import { cn } from "@/lib/utils";

const roles: RoleType[] = [
  "super_admin",
  "ops_manager",
  "dispatcher",
  "inspector",
  "viewer",
];

const userSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  phone: z.string().min(11, "手机号不正确"),
  role: z.enum(["super_admin","ops_manager","dispatcher","inspector","viewer"] as const),
  status: z.enum(["active","disabled"] as const),
});

type UserForm = z.infer<typeof userSchema>;

export function UserManagement() {
  const {
    users,
    addUser,
    updateUser,
    toggleUser,
  } = useSettings();

  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const filtered = useMemo(() => {
    if (!search) return users;
    return users.filter(u =>
      u.name.includes(search) || u.phone.includes(search)
    );
  }, [search, users]);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      { accessorKey: "name", header: "姓名" },
      { accessorKey: "phone", header: "手机号" },
      { accessorKey: "role", header: "角色" },
      {
        accessorKey: "status",
        header: "状态",
        cell: ({ getValue }) => {
          const val = getValue() as string;
          return (
            <span className={cn(val === "active" ? "text-green-600" : "text-red-600")}>{val}</span>
          );
        },
      },
      { accessorKey: "lastLogin", header: "最近登录" },
      {
        id: "actions",
        header: "操作",
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => { setEditing(u); setDrawerOpen(true); }}>编辑</Button>
              <Button size="sm" variant="outline" onClick={() => toggleUser(u.id, u.status !== "active")}>{u.status === "active" ? "禁用" : "启用"}</Button>
            </div>
          );
        },
      },
    ],
    [toggleUser]
  );

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", phone: "", role: "viewer", status: "active" },
  });

  const onSubmit = (data: UserForm) => {
    if (editing) {
      updateUser(editing.id, data);
    } else {
      addUser(data);
    }
    setDrawerOpen(false);
    form.reset();
  };

  const openNew = () => {
    setEditing(null);
    form.reset();
    setDrawerOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="搜索姓名或手机号"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={openNew}>新增用户</Button>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(hg => (
            <TableRow key={hg.id}>
              {hg.headers.map(h => (
                <TableHead key={h.id}>
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{editing ? "编辑用户" : "新增用户"}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">姓名</Label>
                <Input {...form.register("name")} id="name" />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">手机号</Label>
                <Input {...form.register("phone")} id="phone" />
                {form.formState.errors.phone && (
                  <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">角色</Label>
                <Select
                  onValueChange={val => form.setValue("role", val as RoleType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {roles.map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.watch("status") === "active"}
                  onCheckedChange={v => form.setValue("status", v ? "active" : "disabled")}
                />
                <span>启用</span>
              </div>
              <div className="flex justify-end">
                <Button type="submit">保存</Button>
              </div>
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
