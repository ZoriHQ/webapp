'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import type Zoriapi from 'zorihq'

import type { ChartConfig } from '@/components/ui/chart'
import type { TimeRange } from '@/hooks/use-analytics'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'An interactive area chart'

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  desktop: {
    label: 'Desktop',
    color: 'hsl(217, 91%, 60%)',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(32, 98%, 56%)',
  },
} satisfies ChartConfig

interface ChartAreaInteractiveProps {
  data?: Array<Zoriapi.V1.Analytics.UniqueVisitorsDataPoint>
  isLoading?: boolean
  timeRange: TimeRange
}

export function ChartAreaInteractive({
  data,
  isLoading = false,
  timeRange,
}: ChartAreaInteractiveProps) {
  // Transform API data to chart format with proper grouping
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      return []
    }

    // For hourly data (last_hour, today), don't aggregate - show each data point
    if (timeRange === 'last_hour' || timeRange === 'today') {
      return data.map((item) => ({
        date: item.timestamp || '',
        desktop: item.desktop || 0,
        mobile: item.mobile || 0,
      }))
    }

    // For multi-day periods (last_7_days, last_30_days, last_90_days), aggregate by day
    const aggregatedByDay = new Map<string, { desktop: number; mobile: number }>()

    data.forEach((item) => {
      if (!item.timestamp) return

      // Get the date portion only (YYYY-MM-DD)
      const date = new Date(item.timestamp)
      const dateKey = date.toISOString().split('T')[0]

      const existing = aggregatedByDay.get(dateKey) || { desktop: 0, mobile: 0 }
      aggregatedByDay.set(dateKey, {
        desktop: existing.desktop + (item.desktop || 0),
        mobile: existing.mobile + (item.mobile || 0),
      })
    })

    // Convert map to array and sort by date
    return Array.from(aggregatedByDay.entries())
      .map(([dateKey, values]) => ({
        date: `${dateKey}T00:00:00Z`, // Use midnight UTC for consistent date display
        desktop: values.desktop,
        mobile: values.mobile,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [data, timeRange])

  const hasData = chartData.length > 0

  // Calculate key metrics from chart data
  const metrics = React.useMemo(() => {
    if (!hasData) return { total: 0, desktop: 0, mobile: 0, desktopPercent: 0, mobilePercent: 0 }

    const total = chartData.reduce((sum, item) => sum + item.desktop + item.mobile, 0)
    const desktop = chartData.reduce((sum, item) => sum + item.desktop, 0)
    const mobile = chartData.reduce((sum, item) => sum + item.mobile, 0)

    return {
      total,
      desktop,
      mobile,
      desktopPercent: total > 0 ? (desktop / total) * 100 : 0,
      mobilePercent: total > 0 ? (mobile / total) * 100 : 0,
    }
  }, [chartData, hasData])

  return (
    <Card className="@container/card h-full">
      <CardHeader>
        <div className="flex flex-col gap-3">
          <div>
            <CardTitle>Unique Visitors</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                Desktop and mobile visitors over time
              </span>
              <span className="@[540px]/card:hidden">Visitors over time</span>
            </CardDescription>
          </div>
          {hasData && !isLoading && (
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-semibold">{metrics.total.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[hsl(217,91%,60%)]" />
                <span className="text-muted-foreground">Desktop:</span>
                <span className="font-semibold">{metrics.desktop.toLocaleString()}</span>
                <span className="text-muted-foreground text-xs">({metrics.desktopPercent.toFixed(1)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[hsl(32,98%,56%)]" />
                <span className="text-muted-foreground">Mobile:</span>
                <span className="font-semibold">{metrics.mobile.toLocaleString()}</span>
                <span className="text-muted-foreground text-xs">({metrics.mobilePercent.toFixed(1)}%)</span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-sm text-muted-foreground">Loading chart data...</p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center h-[250px] text-center">
            <p className="text-sm text-muted-foreground">
              No visitor data available for this time period
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Try selecting a different time range or check back later
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.2}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                // For hourly data (last_hour, today), show time
                if (timeRange === 'last_hour' || timeRange === 'today') {
                  return date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })
                }
                // For daily/weekly/monthly data, show date
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    // For hourly data (last_hour, today), show full date + time
                    if (timeRange === 'last_hour' || timeRange === 'today') {
                      return date.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })
                    }
                    // For daily/weekly/monthly data, show date only
                    return date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="monotone"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="monotone"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              stackId="a"
            />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
