"use client";
import React, { useState, useMemo } from "react";
import { useSettings } from "../hooks/useSettings";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export function OperationLog() {
  const { logs } = useSettings();
  const [searchUser, setSearchUser] = useState("");
  const [searchAction, setSearchAction] = useState("");

  const filtered = useMemo(() => {
    return logs.filter(l => {
      if (searchUser && !l.userName.includes(searchUser)) return false;
      if (searchAction && !l.action.includes(searchAction)) return false;
      return true;
    });
  }, [logs, searchUser, searchAction]);

  const exportExcel = () => {
    // simple CSV export
    const header = ["时间","用户","操作","对象","结果"].join(",") + "\n";
    const body = filtered
      .map(l => [l.timestamp, l.userName, l.action, l.objectType, l.result].join(","))
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logs.csv";
    a.click();
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="用户"
          value={searchUser}
          onChange={e => setSearchUser(e.target.value)}
        />
        <Input
          placeholder="操作"
          value={searchAction}
          onChange={e => setSearchAction(e.target.value)}
        />
        <Button onClick={exportExcel}>导出</Button>
      </div>
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>时间</TableHead>
              <TableHead>用户</TableHead>
              <TableHead>操作</TableHead>
              <TableHead>对象</TableHead>
              <TableHead>结果</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(l => (
              <TableRow key={l.id}>
                <TableCell>{format(new Date(l.timestamp), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                <TableCell>{l.userName}</TableCell>
                <TableCell>{l.action}</TableCell>
                <TableCell>{l.objectType}</TableCell>
                <TableCell>{l.result}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
