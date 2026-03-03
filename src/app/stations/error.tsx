"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("站点管理页面错误:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">站点管理错误</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            站点管理页面加载时出现了错误。请尝试刷新页面或返回首页。
          </p>
          {error.message && (
            <div className="p-3 bg-red-50 rounded-lg text-left">
              <p className="text-sm text-red-800 font-mono">{error.message}</p>
            </div>
          )}
          <div className="space-y-2">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              重试
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/"} className="w-full">
              返回首页
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
