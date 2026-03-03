/**
 * @file app/stations/components/QRCodeModal.tsx
 * @description 二维码模态框，支持下载PNG
 * @module 模块2:站点管理
 */

"use client";

import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";

interface QRCodeModalProps {
  readonly value: string;
  readonly label?: string;
  readonly trigger?: React.ReactNode;
}

export function QRCodeModal({ value, label = "二维码", trigger }: QRCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${label}.png`;
    link.click();
  };

  return (
    <Dialog>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className="w-[260px]">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <QRCodeCanvas value={value} size={200} level="H" includeMargin={true} ref={canvasRef as any} />
          <Button size="sm" onClick={handleDownload}>下载PNG</Button>
        </div>
        <DialogClose className="sr-only" />
      </DialogContent>
    </Dialog>
  );
}

export default QRCodeModal;