/**
 * @file src/lib/design-tokens.ts
 * @description 统一设计规范变量
 * @module 设计系统
 */

// ==================== 颜色系统 ====================

export const COLORS = {
  // 主色调
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // 状态色
  status: {
    online: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    offline: '#6b7280',
    maintenance: '#8b5cf6',
  },
  
  // 中性色
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // 语义色
  semantic: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
} as const;

// ==================== 间距系统 ====================

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const;

// ==================== 圆角系统 ====================

export const BORDER_RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
} as const;

// ==================== 阴影系统 ====================

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

// ==================== 动画系统 ====================

export const ANIMATION = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },
  easing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ==================== 字体系统 ====================

export const TYPOGRAPHY = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

// ==================== 布局系统 ====================

export const LAYOUT = {
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  sidebar: {
    width: '280px',
    collapsedWidth: '80px',
  },
  header: {
    height: '64px',
  },
} as const;

// ==================== 断点系统 ====================

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ==================== 组件样式预设 ====================

export const COMPONENT_PRESETS = {
  // 卡片样式
  card: {
    base: {
      backgroundColor: 'white',
      borderRadius: BORDER_RADIUS.lg,
      boxShadow: SHADOWS.sm,
      border: `1px solid ${COLORS.neutral[200]}`,
      padding: SPACING.lg,
      transition: `all ${ANIMATION.duration.normal} ${ANIMATION.easing.ease}`,
    },
    hover: {
      boxShadow: SHADOWS.md,
      transform: 'translateY(-2px)',
    },
    interactive: {
      cursor: 'pointer',
      '&:hover': {
        boxShadow: SHADOWS.md,
        transform: 'translateY(-2px)',
      },
    },
  },
  
  // 按钮样式
  button: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${SPACING.sm} ${SPACING.md}`,
      borderRadius: BORDER_RADIUS.md,
      fontSize: TYPOGRAPHY.fontSize.sm,
      fontWeight: TYPOGRAPHY.fontWeight.medium,
      transition: `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
    },
    primary: {
      backgroundColor: COLORS.primary[500],
      color: 'white',
      '&:hover': {
        backgroundColor: COLORS.primary[600],
      },
    },
    secondary: {
      backgroundColor: 'white',
      color: COLORS.neutral[700],
      border: `1px solid ${COLORS.neutral[300]}`,
      '&:hover': {
        backgroundColor: COLORS.neutral[50],
      },
    },
  },
  
  // 输入框样式
  input: {
    base: {
      width: '100%',
      padding: `${SPACING.sm} ${SPACING.md}`,
      borderRadius: BORDER_RADIUS.md,
      border: `1px solid ${COLORS.neutral[300]}`,
      fontSize: TYPOGRAPHY.fontSize.sm,
      transition: `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
      outline: 'none',
    },
    focus: {
      borderColor: COLORS.primary[500],
      boxShadow: `0 0 0 3px ${COLORS.primary[100]}`,
    },
    error: {
      borderColor: COLORS.semantic.error,
      '&:focus': {
        borderColor: COLORS.semantic.error,
        boxShadow: `0 0 0 3px rgb(239 68 68 / 0.1)`,
      },
    },
  },
} as const;

// ==================== 工具函数 ====================

export const utils = {
  // 获取状态颜色
  getStatusColor: (status: keyof typeof COLORS.status) => COLORS.status[status],
  
  // 获取过渡样式
  getTransition: (duration: keyof typeof ANIMATION.duration = 'normal') => 
    `${ANIMATION.duration[duration]} ${ANIMATION.easing.ease}`,
  
  // 获取响应式样式
  getResponsive: (property: string, values: Record<string, string>) => {
    return Object.entries(values)
      .map(([breakpoint, value]) => {
        if (breakpoint === 'base') return `${property}: ${value};`;
        return `@media (min-width: ${BREAKPOINTS[breakpoint as keyof typeof BREAKPOINTS]}) { ${property}: ${value}; }`;
      })
      .join('\n');
  },
} as const;
