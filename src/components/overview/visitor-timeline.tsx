import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, Dot, XAxis, YAxis } from 'recharts'

import type { ChartConfig } from '@/components/ui/chart'
import { useVisitorsTimeline } from '@/hooks/use-analytics'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { useAppContext } from '@/contexts/app.context'

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
  revenue: {
    label: 'Revenue',
    color: 'hsl(142, 76%, 36%)',
  },
} satisfies ChartConfig

export function VisitorTimeline() {
  const { storedValues } = useAppContext()
  const { data, isLoading } = useVisitorsTimeline({
    project_id: storedValues!.projectId!,
    time_range: storedValues!.timeRange,
  })

  const chartData = useMemo(() => {
    if (!data?.data) return []

    return data.data.map((item) => {
      const timestamp = item.time_bucket
        ? new Date(item.time_bucket).getTime()
        : 0

      return {
        date: timestamp,
        desktop:
          (item.num_desktop_visits ?? 0) + (item.num_unknown_visits ?? 0),
        mobile: item.num_mobile_visits ?? 0,
        revenue: item.num_revenue ?? 0,
      }
    })
  }, [data])

  const hasData = chartData.length > 0

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null

    const timestamp = typeof label === 'number' ? label : Number(label)
    const date = new Date(timestamp)
    const timeRange = storedValues!.timeRange

    let formattedDate = ''
    if (timeRange === 'last_hour' || timeRange === 'today') {
      formattedDate = date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    } else {
      formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    }

    const desktop =
      payload.find((p: any) => p.dataKey === 'desktop')?.value || 0
    const mobile = payload.find((p: any) => p.dataKey === 'mobile')?.value || 0
    const revenue =
      payload.find((p: any) => p.dataKey === 'revenue')?.value || 0
    const total = desktop + mobile

    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
        <p className="text-sm font-medium text-foreground mb-2">
          {formattedDate}
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: 'hsl(217, 91%, 60%)' }}
              />
              <span className="text-sm text-muted-foreground">Desktop</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {desktop.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: 'hsl(32, 98%, 56%)' }}
              />
              <span className="text-sm text-muted-foreground">Mobile</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {mobile.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: 'hsl(142, 76%, 36%)' }}
              />
              <span className="text-sm text-muted-foreground">Revenue</span>
            </div>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              ${revenue.toLocaleString()}
            </span>
          </div>
          <div className="h-px bg-border my-1.5" />
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-foreground">
              Total Visitors
            </span>
            <span className="text-sm font-bold text-foreground">
              {total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Visitor Activity</CardTitle>
        <CardDescription>
          {isLoading
            ? 'Loading visitor timeline...'
            : 'Visitor timeline over time'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[320px]">
            <p className="text-sm text-muted-foreground">
              Loading timeline data...
            </p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center h-[320px] text-center">
            <p className="text-sm text-muted-foreground">
              No visitor data available for this period
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[320px] w-full"
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
                  const timeRange = storedValues!.timeRange
                  const date = new Date(value)
                  if (timeRange === 'last_hour' || timeRange === 'today') {
                    return date.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })
                  }
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.toLocaleString()}
                allowDecimals={false}
              />
              <ChartTooltip content={<CustomTooltip />} />
              <Area
                dataKey="mobile"
                type="monotone"
                fill="url(#fillMobile)"
                stroke="var(--color-mobile)"
                strokeWidth={2}
                stackId="a"
                dot={(props: any) => {
                  const hasRevenue = props.payload?.revenue > 0
                  if (!hasRevenue) return <></>
                  return (
                    <Dot
                      {...props}
                      r={4}
                      fill="hsl(142, 76%, 36%)"
                      stroke="hsl(142, 76%, 36%)"
                      strokeWidth={2}
                    />
                  )
                }}
                activeDot={{ r: 5, strokeWidth: 2 }}
              />
              <Area
                dataKey="desktop"
                type="monotone"
                fill="url(#fillDesktop)"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                stackId="a"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2 }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
