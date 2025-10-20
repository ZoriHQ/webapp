'use client'

import * as React from 'react'
import type Zoriapi from 'zorihq'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import type { ChartConfig } from '@/components/ui/chart'
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { TimeRange } from '@/hooks/use-analytics'

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
  data?: Zoriapi.V1.Analytics.UniqueVisitorsDataPoint[]
  isLoading?: boolean
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
}

export function ChartAreaInteractive({
  data,
  isLoading = false,
  timeRange,
  onTimeRangeChange,
}: ChartAreaInteractiveProps) {
  // Transform API data to chart format
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      return []
    }

    return data.map((item) => ({
      date: item.timestamp || '',
      desktop: item.desktop || 0,
      mobile: item.mobile || 0,
    }))
  }, [data])

  const hasData = chartData.length > 0

  const timeRangeLabel = {
    last_hour: 'Last Hour',
    today: 'Today',
    last_7_days: 'Last 7 Days',
    last_30_days: 'Last 30 Days',
    last_90_days: 'Last 90 Days',
  }[timeRange] || 'Last 7 Days'

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Unique Visitors</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Desktop and mobile visitors over time
          </span>
          <span className="@[540px]/card:hidden">Visitors over time</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => value && onTimeRangeChange(value as TimeRange)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="last_90_days">Last 90 Days</ToggleGroupItem>
            <ToggleGroupItem value="last_30_days">Last 30 Days</ToggleGroupItem>
            <ToggleGroupItem value="last_7_days">Last 7 Days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={(value) => onTimeRangeChange(value as TimeRange)}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder={timeRangeLabel} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="last_90_days" className="rounded-lg">
                Last 90 Days
              </SelectItem>
              <SelectItem value="last_30_days" className="rounded-lg">
                Last 30 Days
              </SelectItem>
              <SelectItem value="last_7_days" className="rounded-lg">
                Last 7 Days
              </SelectItem>
              <SelectItem value="today" className="rounded-lg">
                Today
              </SelectItem>
              <SelectItem value="last_hour" className="rounded-lg">
                Last Hour
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
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
                    return new Date(value).toLocaleDateString('en-US', {
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
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
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
