import type { StationType } from "@/lib/CONTRACT";

// 可针对模块2进行拓展
export interface Station extends StationType {
  /** 站点二维码地址（可在后台生成） */
  qrCodeUrl?: string;
  /** 简洁卡片模式时隐藏一些字段 */
  compactMode?: boolean;
}
