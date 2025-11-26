// Tremor Chart Utilities [v1.0.0]
// Based on https://www.tremor.so/docs/utilities/chartUtils

export type ColorUtility = 'bg' | 'stroke' | 'fill' | 'text'

export const chartColors = {
  blue: {
    bg: 'bg-blue-500',
    stroke: 'stroke-blue-500',
    fill: 'fill-blue-500',
    text: 'text-blue-500',
  },
  emerald: {
    bg: 'bg-emerald-500',
    stroke: 'stroke-emerald-500',
    fill: 'fill-emerald-500',
    text: 'text-emerald-500',
  },
  violet: {
    bg: 'bg-violet-500',
    stroke: 'stroke-violet-500',
    fill: 'fill-violet-500',
    text: 'text-violet-500',
  },
  amber: {
    bg: 'bg-amber-500',
    stroke: 'stroke-amber-500',
    fill: 'fill-amber-500',
    text: 'text-amber-500',
  },
  gray: {
    bg: 'bg-gray-500',
    stroke: 'stroke-gray-500',
    fill: 'fill-gray-500',
    text: 'text-gray-500',
  },
  cyan: {
    bg: 'bg-cyan-500',
    stroke: 'stroke-cyan-500',
    fill: 'fill-cyan-500',
    text: 'text-cyan-500',
  },
  pink: {
    bg: 'bg-pink-500',
    stroke: 'stroke-pink-500',
    fill: 'fill-pink-500',
    text: 'text-pink-500',
  },
  lime: {
    bg: 'bg-lime-500',
    stroke: 'stroke-lime-500',
    fill: 'fill-lime-500',
    text: 'text-lime-500',
  },
  fuchsia: {
    bg: 'bg-fuchsia-500',
    stroke: 'stroke-fuchsia-500',
    fill: 'fill-fuchsia-500',
    text: 'text-fuchsia-500',
  },
  red: {
    bg: 'bg-red-500',
    stroke: 'stroke-red-500',
    fill: 'fill-red-500',
    text: 'text-red-500',
  },
  orange: {
    bg: 'bg-orange-500',
    stroke: 'stroke-orange-500',
    fill: 'fill-orange-500',
    text: 'text-orange-500',
  },
  indigo: {
    bg: 'bg-indigo-500',
    stroke: 'stroke-indigo-500',
    fill: 'fill-indigo-500',
    text: 'text-indigo-500',
  },
} as const satisfies {
  [color: string]: {
    [key in ColorUtility]: string
  }
}

export type AvailableChartColorsKeys = keyof typeof chartColors

export const AvailableChartColors: Array<AvailableChartColorsKeys> =
  Object.keys(chartColors) as Array<AvailableChartColorsKeys>

export const constructCategoryColors = (
  categories: Array<string>,
  colors: Array<AvailableChartColorsKeys>,
): Map<string, AvailableChartColorsKeys> => {
  const categoryColors = new Map<string, AvailableChartColorsKeys>()
  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length])
  })
  return categoryColors
}

export const getColorClassName = (
  color: AvailableChartColorsKeys,
  type: ColorUtility,
): string => {
  return chartColors[color][type]
}

// Get y-axis domain based on min/max values
export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined,
): [number | 'auto', number | 'auto'] => {
  const min = autoMinValue ? 'auto' : (minValue ?? 0)
  const max = maxValue ?? 'auto'
  return [min, max]
}

// Check if all objects in array have the same value for a specific key
export const hasOnlyOneValueForKey = (
  array: Array<Record<string, unknown>>,
  key: string,
): boolean => {
  if (array.length === 0) return true
  const firstValue = array[0][key]
  return array.every((item) => item[key] === firstValue)
}

// Color hex values for use with Recharts (which needs actual color values, not Tailwind classes)
export const chartColorHex: Record<AvailableChartColorsKeys, string> = {
  blue: '#3b82f6',
  emerald: '#10b981',
  violet: '#8b5cf6',
  amber: '#f59e0b',
  gray: '#6b7280',
  cyan: '#06b6d4',
  pink: '#ec4899',
  lime: '#84cc16',
  fuchsia: '#d946ef',
  red: '#ef4444',
  orange: '#f97316',
  indigo: '#6366f1',
}

export const getChartColorHex = (color: AvailableChartColorsKeys): string => {
  return chartColorHex[color]
}
