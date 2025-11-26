// Tremor AreaChart [v1.0.0]
// Based on https://www.tremor.so/docs/visualizations/area-chart

'use client'

import * as React from 'react'
import {
  Area,
  CartesianGrid,
  AreaChart as RechartsAreaChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { AvailableChartColorsKeys } from '@/lib/chart-utils'
import { cn } from '@/lib/utils'
import {
  AvailableChartColors,
  getChartColorHex,
  getYAxisDomain,
} from '@/lib/chart-utils'

// Chart tooltip component
interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    name: string
    color: string
    dataKey: string
    payload: Record<string, unknown>
  }>
  label?: string
  valueFormatter?: (value: number) => string
  labelFormatter?: (label: string) => string
  categoryColors: Map<string, string>
}

function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter = (value) => value.toString(),
  labelFormatter,
  categoryColors,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg">
      <p className="mb-2 text-sm font-medium text-foreground">
        {labelFormatter ? labelFormatter(label ?? '') : label}
      </p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor:
                    categoryColors.get(entry.dataKey) ?? entry.color,
                }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name}
              </span>
            </div>
            <span className="text-sm font-medium tabular-nums text-foreground">
              {valueFormatter(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Chart legend component
interface ChartLegendProps {
  payload?: Array<{
    value: string
    color: string
    dataKey: string
  }>
  categoryColors: Map<string, string>
  onCategoryClick?: (category: string) => void
  activeLegend?: string
}

function ChartLegend({
  payload,
  categoryColors,
  onCategoryClick,
  activeLegend,
}: ChartLegendProps) {
  if (!payload?.length) return null

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
      {payload.map((entry, index) => {
        const isActive = !activeLegend || activeLegend === entry.dataKey
        return (
          <button
            key={index}
            type="button"
            onClick={() => onCategoryClick?.(entry.dataKey)}
            className={cn(
              'flex items-center gap-1.5 text-sm transition-opacity',
              isActive ? 'opacity-100' : 'opacity-40',
              onCategoryClick
                ? 'cursor-pointer hover:opacity-80'
                : 'cursor-default',
            )}
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  categoryColors.get(entry.dataKey) ?? entry.color,
              }}
            />
            <span className="text-muted-foreground">{entry.value}</span>
          </button>
        )
      })}
    </div>
  )
}

export type AreaChartType = 'default' | 'stacked' | 'percent'

export interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<Record<string, unknown>>
  index: string
  categories: Array<string>
  colors?: Array<AvailableChartColorsKeys>
  valueFormatter?: (value: number) => string
  xAxisLabel?: string
  yAxisLabel?: string
  type?: AreaChartType
  showLegend?: boolean
  showGridLines?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showTooltip?: boolean
  autoMinValue?: boolean
  minValue?: number
  maxValue?: number
  connectNulls?: boolean
  allowDecimals?: boolean
  fill?: 'gradient' | 'solid' | 'none'
  tickGap?: number
  startEndOnly?: boolean
  onValueChange?: (
    value: { eventType: string; categoryClicked?: string } | null,
  ) => void
  customTooltip?: React.ComponentType<{
    active?: boolean
    payload?: Array<{
      value: number
      name: string
      payload: Record<string, unknown>
    }>
    label?: string
  }>
  xAxisFormatter?: (value: string) => string
  yAxisFormatter?: (value: number) => string
  labelFormatter?: (label: string) => string
  /** Reference dots to display on the chart (e.g., for revenue markers) */
  referenceDots?: Array<{
    x: string | number
    y: number
    color?: string
    radius?: number
  }>
}

export function AreaChart({
  data = [],
  index,
  categories = [],
  colors = AvailableChartColors,
  valueFormatter = (value) => value.toLocaleString(),
  xAxisLabel,
  yAxisLabel,
  type = 'default',
  showLegend = true,
  showGridLines = true,
  showXAxis = true,
  showYAxis = true,
  showTooltip = true,
  autoMinValue = false,
  minValue,
  maxValue,
  connectNulls = false,
  allowDecimals = true,
  fill = 'gradient',
  tickGap = 5,
  startEndOnly = false,
  onValueChange,
  customTooltip: CustomTooltip,
  xAxisFormatter,
  yAxisFormatter,
  labelFormatter,
  referenceDots,
  className,
  ...props
}: AreaChartProps) {
  const [activeLegend, setActiveLegend] = React.useState<string | undefined>(
    undefined,
  )

  const categoryColors = React.useMemo(() => {
    const colorMap = new Map<string, string>()
    categories.forEach((category, idx) => {
      colorMap.set(category, getChartColorHex(colors[idx % colors.length]))
    })
    return colorMap
  }, [categories, colors])

  const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue)

  const handleLegendClick = (category: string) => {
    setActiveLegend((prev) => (prev === category ? undefined : category))
    onValueChange?.({
      eventType: 'category',
      categoryClicked: category,
    })
  }

  const getGradientId = (category: string) =>
    `gradient-${category.replace(/\s+/g, '-')}`

  return (
    <div className={cn('w-full', className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          stackOffset={
            type === 'percent'
              ? 'expand'
              : type === 'stacked'
                ? 'none'
                : undefined
          }
        >
          {showGridLines && (
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              className="stroke-muted"
            />
          )}

          {showXAxis && (
            <XAxis
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={tickGap}
              tickFormatter={xAxisFormatter}
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-muted-foreground"
              interval={
                startEndOnly ? 'preserveStartEnd' : 'equidistantPreserveStart'
              }
              label={
                xAxisLabel
                  ? {
                      value: xAxisLabel,
                      position: 'bottom',
                      offset: 0,
                      fontSize: 12,
                    }
                  : undefined
              }
            />
          )}

          {showYAxis && (
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={
                yAxisFormatter ??
                (type === 'percent'
                  ? (value) => `${(value * 100).toFixed(0)}%`
                  : valueFormatter)
              }
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-muted-foreground"
              domain={yAxisDomain}
              allowDecimals={allowDecimals}
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: 'insideLeft',
                      fontSize: 12,
                    }
                  : undefined
              }
            />
          )}

          {showTooltip && (
            <Tooltip
              content={
                CustomTooltip ? (
                  <CustomTooltip />
                ) : (
                  <ChartTooltip
                    valueFormatter={
                      type === 'percent'
                        ? (value) => `${(value * 100).toFixed(1)}%`
                        : valueFormatter
                    }
                    labelFormatter={labelFormatter}
                    categoryColors={categoryColors}
                  />
                )
              }
              cursor={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
            />
          )}

          <defs>
            {categories.map((category) => {
              const color = categoryColors.get(category)
              return (
                <linearGradient
                  key={category}
                  id={getGradientId(category)}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
              )
            })}
          </defs>

          {categories.map((category) => {
            const color = categoryColors.get(category)
            const isHidden = activeLegend && activeLegend !== category

            return (
              <Area
                key={category}
                name={category}
                type="monotone"
                dataKey={category}
                stroke={color}
                strokeWidth={2}
                fill={
                  fill === 'gradient'
                    ? `url(#${getGradientId(category)})`
                    : fill === 'solid'
                      ? color
                      : 'transparent'
                }
                fillOpacity={fill === 'none' ? 0 : isHidden ? 0.1 : 1}
                strokeOpacity={isHidden ? 0.3 : 1}
                stackId={
                  type === 'stacked' || type === 'percent' ? 'stack' : undefined
                }
                connectNulls={connectNulls}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: color,
                  fill: 'var(--background)',
                }}
              />
            )
          })}

          {/* Reference dots for markers (e.g., revenue indicators) */}
          {referenceDots?.map((dot, idx) => (
            <ReferenceDot
              key={idx}
              x={dot.x}
              y={dot.y}
              r={dot.radius ?? 6}
              fill={dot.color ?? '#10b981'}
              stroke="#ffffff"
              strokeWidth={2}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>

      {showLegend && (
        <ChartLegend
          payload={categories.map((category) => ({
            value: category,
            color: categoryColors.get(category) ?? '',
            dataKey: category,
          }))}
          categoryColors={categoryColors}
          onCategoryClick={handleLegendClick}
          activeLegend={activeLegend}
        />
      )}
    </div>
  )
}
