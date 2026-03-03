/**
 * @file app/stations/components/DiscoveryBar.tsx
 * @description 导航层（增强版，带下拉筛选）
 * @module 模块2:站点管理
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Map, List, Filter, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";

type ViewMode = "map" | "list";

type CardMode = "compact" | "detailed";

interface DiscoveryBarProps {
  readonly viewMode: ViewMode;
  readonly onViewModeChange: (mode: ViewMode) => void;
  readonly cardMode: CardMode;
  readonly onCardModeChange: (mode: CardMode) => void;
  readonly onSearchChange: (query: string) => void;
  readonly onStatusFilterChange: (statuses: string[]) => void;
  readonly selectedStatuses: string[];
  readonly totalCount: number;
}

const STATUS_OPTIONS = [
  { value: "online", label: "在线", color: COLORS.status.online },
  { value: "offline", label: "离线", color: COLORS.status.offline },
  { value: "warning", label: "告警", color: COLORS.status.warning },
  { value: "danger", label: "紧急", color: COLORS.semantic.error },
];

export function DiscoveryBar({
  viewMode,
  onViewModeChange,
  cardMode,
  onCardModeChange,
  onSearchChange,
  onStatusFilterChange,
  selectedStatuses,
  totalCount,
}: DiscoveryBarProps) {
  const [searchValue, setSearchValue] = useState("");

  // 搜索同步
  useEffect(() => {
    onSearchChange(searchValue);
  }, [searchValue, onSearchChange]);

  // 切换状态筛选
  const toggleStatus = useCallback((status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    onStatusFilterChange(newStatuses);
  }, [selectedStatuses, onStatusFilterChange]);

  // 样式配置
  const containerStyles = useMemo(() => ({
    height: '56px',
    padding: `0 ${SPACING.md}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
    backgroundColor: `${COLORS.neutral[900]}80`,
    borderBottom: `1px solid ${COLORS.neutral[700]}50`,
  }), []);

  const searchContainerStyles = useMemo(() => ({
    position: 'relative' as const,
    flex: 1,
    maxWidth: '400px',
  }), []);

  const searchIconStyles = useMemo(() => ({
    position: 'absolute' as const,
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '16px',
    height: '16px',
    color: COLORS.neutral[500],
  }), []);

  const inputStyles = useMemo(() => ({
    paddingLeft: '36px',
    backgroundColor: COLORS.neutral[800],
    border: `1px solid ${COLORS.neutral[700]}`,
    color: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.md,
    '&::placeholder': {
      color: COLORS.neutral[500],
    },
    '&:focus': {
      borderColor: COLORS.primary[500],
      boxShadow: `0 0 0 3px ${COLORS.primary[100]}`,
    }
  }), []);

  const buttonGroupStyles = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[800],
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xs,
    border: `1px solid ${COLORS.neutral[700]}`,
  }), []);

  const dropdownButtonStyles = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: selectedStatuses.length > 0 ? `${COLORS.primary[500]}20` : 'transparent',
    border: selectedStatuses.length > 0 ? `1px solid ${COLORS.primary[500]}50` : '1px solid transparent',
    borderRadius: BORDER_RADIUS.md,
    padding: `${SPACING.xs} ${SPACING.sm}`,
    color: selectedStatuses.length > 0 ? COLORS.primary[500] : COLORS.neutral[300],
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    transition: `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
    '&:hover': {
      backgroundColor: selectedStatuses.length > 0 ? `${COLORS.primary[500]}30` : COLORS.neutral[700],
      color: COLORS.neutral[200],
    }
  }), []);

  const badgeStyles = useMemo(() => ({
    marginLeft: SPACING.xs,
    backgroundColor: COLORS.primary[500],
    color: 'white',
    borderRadius: BORDER_RADIUS.full,
    padding: `0 ${SPACING.xs}`,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  }), []);

  const countStyles = useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.neutral[500],
    minWidth: '100px',
    textAlign: 'right' as const,
  }), []);

  return (
    <div style={containerStyles}>
      {/* 搜索框 */}
      <div style={searchContainerStyles}>
        <Search style={searchIconStyles} />
        <Input
          placeholder="搜索站点名称或地址..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={inputStyles}
        />
      </div>

      {/* 状态筛选下拉 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            style={dropdownButtonStyles}
          >
            <Filter style={{ width: '16px', height: '16px' }} />
            状态筛选
            {selectedStatuses.length > 0 && (
              <span style={badgeStyles}>
                {selectedStatuses.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" style={{
          width: '176px',
          backgroundColor: COLORS.neutral[800],
          border: `1px solid ${COLORS.neutral[700]}`,
          borderRadius: BORDER_RADIUS.lg,
        }}>
          {STATUS_OPTIONS.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedStatuses.includes(option.value)}
              onCheckedChange={() => toggleStatus(option.value)}
              style={{
                color: COLORS.neutral[300],
                '&:focus': {
                  backgroundColor: COLORS.neutral[700],
                  color: COLORS.neutral[100],
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: BORDER_RADIUS.full,
                  backgroundColor: option.color
                }} />
                <span>{option.label}</span>
              </div>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 视图切换 */}
      <div style={buttonGroupStyles}>
        <Button
          variant={viewMode === "map" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("map")}
          style={{
            backgroundColor: viewMode === "map" ? COLORS.neutral[700] : 'transparent',
            color: viewMode === "map" ? COLORS.neutral[100] : COLORS.neutral[400],
            border: 'none',
            borderRadius: 0,
            transition: `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
            '&:hover': {
              backgroundColor: COLORS.neutral[700],
              color: COLORS.neutral[200],
            }
          }}
        >
          <Map style={{ width: '16px', height: '16px' }} />
          地图
        </Button>
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("list")}
          style={{
            backgroundColor: viewMode === "list" ? COLORS.neutral[700] : 'transparent',
            color: viewMode === "list" ? COLORS.neutral[100] : COLORS.neutral[400],
            border: 'none',
            borderRadius: 0,
            transition: `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
            '&:hover': {
              backgroundColor: COLORS.neutral[700],
              color: COLORS.neutral[200],
            }
          }}
        >
          <List style={{ width: '16px', height: '16px' }} />
          列表
        </Button>
      </div>

      {/* 卡片模式切换，仅在列表视图可见 */}
      {viewMode === "list" && (
        <div style={buttonGroupStyles}>
          <Button
            variant={cardMode === "compact" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onCardModeChange("compact")}
            style={{
              backgroundColor: cardMode === "compact" ? COLORS.neutral[700] : 'transparent',
              color: cardMode === "compact" ? COLORS.neutral[100] : COLORS.neutral[400],
              border: 'none',
              borderRadius: 0,
              transition: `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
              '&:hover': {
                backgroundColor: COLORS.neutral[700],
                color: COLORS.neutral[200],
              }
            }}
          >
            <Check style={{ width: '16px', height: '16px' }} />
            紧凑
          </Button>
          <Button
            variant={cardMode === "detailed" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onCardModeChange("detailed")}
            style={{
              backgroundColor: cardMode === "detailed" ? COLORS.neutral[700] : 'transparent',
              color: cardMode === "detailed" ? COLORS.neutral[100] : COLORS.neutral[400],
              border: 'none',
              borderRadius: 0,
              transition: `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
              '&:hover': {
                backgroundColor: COLORS.neutral[700],
                color: COLORS.neutral[200],
              }
            }}
          >
            <Check style={{ width: '16px', height: '16px' }} />
            详细
          </Button>
        </div>
      )}

      {/* 站点计数 */}
      <div style={countStyles}>
        共 <span style={{
          color: COLORS.neutral[300],
          fontWeight: TYPOGRAPHY.fontWeight.medium
        }}>{totalCount}</span> 个站点
      </div>
    </div>
  );
}

export default DiscoveryBar;
