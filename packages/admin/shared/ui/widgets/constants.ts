/**
 * Единая система цветов для компонентов
 */
export const actionColors = {
  orange: {
    bg: "bg-orange-500/[0.06]",
    hover: "hover:bg-orange-500/[0.1]",
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-400",
  },
  amber: {
    bg: "bg-amber-500/[0.06]",
    hover: "hover:bg-amber-500/[0.1]",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
  },
  emerald: {
    bg: "bg-emerald-500/[0.06]",
    hover: "hover:bg-emerald-500/[0.1]",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
  },
  blue: {
    bg: "bg-blue-500/[0.06]",
    hover: "hover:bg-blue-500/[0.1]",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
  },
  purple: {
    bg: "bg-purple-500/[0.06]",
    hover: "hover:bg-purple-500/[0.1]",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-400",
  },
  red: {
    bg: "bg-red-500/[0.06]",
    hover: "hover:bg-red-500/[0.1]",
    iconBg: "bg-red-500/15",
    iconColor: "text-red-400",
  },
} as const;

export type ActionColor = keyof typeof actionColors;

/**
 * Единая система размеров для компонентов
 */
export const componentSizes = {
  sm: {
    height: "h-6",
    text: "text-[9px]",
    textTitle: "text-[10px]",
    textDesc: "text-[8px]",
    padding: "p-1.5",
    paddingX: "px-1.5",
    paddingY: "py-1",
    icon: "h-2.5 w-2.5",
    iconContainer: "h-6 w-6",
    gap: "gap-1",
  },
  md: {
    height: "h-7",
    text: "text-[10px]",
    textTitle: "text-[11px]",
    textDesc: "text-[9px]",
    padding: "p-2",
    paddingX: "px-2",
    paddingY: "py-1.5",
    icon: "h-3 w-3",
    iconContainer: "h-6 w-6",
    gap: "gap-1.5",
  },
  lg: {
    height: "h-9",
    text: "text-xs",
    textTitle: "text-sm",
    textDesc: "text-[10px]",
    padding: "p-3",
    paddingX: "px-4",
    paddingY: "py-2",
    icon: "h-4 w-4",
    iconContainer: "h-8 w-8",
    gap: "gap-2",
  },
} as const;

export type ComponentSize = keyof typeof componentSizes;

/**
 * Единая система отступов
 */
export const spacing = {
  xs: "gap-0.5",
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
  xl: "gap-3",
} as const;

/**
 * Единая система фоновых цветов
 */
export const backgroundColors = {
  default: "bg-[hsl(15,12%,8%)]",
  hover: "hover:bg-[hsl(15,12%,10%)]",
  active: "bg-[hsl(15,12%,12%)]",
  card: "bg-[hsl(15,12%,6%)]",
} as const;

