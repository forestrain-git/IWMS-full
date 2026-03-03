import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl">页面未找到</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            抱歉，您访问的页面不存在。请检查URL是否正确，或返回首页继续浏览。
          </p>
          <div className="space-y-2">
            <Link href="/">
              <Button className="w-full">
                <Home className="h-4 w-4 mr-2" />
                返回首页
              </Button>
            </Link>
            <Link href="/stations">
              <Button variant="outline" className="w-full">
                站点管理
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
