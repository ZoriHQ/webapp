import { formatDuration } from '@/lib/utils'

export type TrendDirection = 'up-good' | 'down-good' | 'neutral'

export interface ChangeIndicatorProps {
  current: number
  previous: number
  trendDirection?: TrendDirection
  formatter?: (value: number) => string
  showPercentChange?: boolean
}

export function formatRate(rate: number | undefined): string {
  if (rate === undefined) return '0%'
  return `${rate.toFixed(1)}%`
}

export function formatPages(pages: number | undefined): string {
  if (pages === undefined) return '0.0'
  return pages.toFixed(1)
}

export function formatHours(hours: number | undefined): string {
  if (hours === undefined) return '0h'
  return formatDuration(hours * 3600)
}

export function renderChangeIndicator({
  current,
  previous,
  trendDirection = 'up-good',
  formatter,
  showPercentChange = false,
}: ChangeIndicatorProps) {
  const change = current - previous
  const percentChange =
    previous > 0 ? ((change / previous) * 100).toFixed(1) : '0.0'

  if (change === 0) {
    return (
      <p className="text-xs text-muted-foreground mt-1">
        No change from previous period
      </p>
    )
  }

  const isPositiveChange = change > 0
  const isGoodChange =
    trendDirection === 'neutral'
      ? false
      : trendDirection === 'up-good'
        ? isPositiveChange
        : !isPositiveChange

  const colorClass = isGoodChange ? 'text-green-600' : 'text-red-600'
  const arrow = isPositiveChange ? '↑' : '↓'

  const formattedChange = formatter
    ? formatter(Math.abs(change))
    : Math.abs(change).toLocaleString()

  return (
    <p className="text-xs text-muted-foreground mt-1">
      <span className={colorClass}>
        {arrow} {formattedChange}
        {showPercentChange && ` (${percentChange}%)`}{' '}
      </span>
      vs previous period
    </p>
  )
}
