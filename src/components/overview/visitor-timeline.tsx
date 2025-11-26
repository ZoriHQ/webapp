import { useMemo } from 'react'

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
import { useVisitorsTimeline } from '@/hooks/use-analytics'
import { Card } from '@/components/ui/card'
import { useAppContext } from '@/contexts/app.context'

const valueFormatter = (number: number) =>
  Intl.NumberFormat('us').format(number)

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

      const desktop =
        (item.num_desktop_visits ?? 0) + (item.num_unknown_visits ?? 0)
      const mobile = item.num_mobile_visits ?? 0
      const visitors = desktop + mobile
      const revenue = (item.num_revenue ?? 0) / 100

      return {
        date: formatDate(timestamp, storedValues!.timeRange),
        visitors,
        revenue,
      }
    })
  }, [data, storedValues])

  const hasData = chartData.length > 0

  // Calculate summary statistics
  const totalVisitorsSum = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.visitors, 0)
  }, [chartData])

  const totalRevenueSum = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.revenue, 0)
  }, [chartData])

  const hasRevenue = totalRevenueSum > 0

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{
      value: number
      dataKey: string
      payload: { revenue: number }
    }>
    label?: string
  }) => {
    if (!active || !payload?.length) return null

    const visitors = payload[0]?.value ?? 0
    const revenue = payload[0]?.payload?.revenue ?? 0

    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span className="text-sm text-muted-foreground">Visitors</span>
            </div>
            <span className="text-sm font-medium tabular-nums text-foreground">
              {valueFormatter(visitors)}
            </span>
          </div>
          {revenue > 0 && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm text-muted-foreground">Revenue</span>
              </div>
              <span className="text-sm font-medium tabular-nums text-foreground">
                $
                {revenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="h-full p-0">
      <div className="p-6 pb-0">
        <h3 className="font-medium text-foreground">Visitor Activity</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          {isLoading
            ? 'Loading visitor timeline...'
            : 'Visitor timeline over time'}
        </p>
      </div>
      <div className="border-t border-border p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-72">
            <p className="text-sm text-muted-foreground">
              Loading timeline data...
            </p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center h-72 text-center">
            <p className="text-sm text-muted-foreground">
              No visitor data available for this period
            </p>
          </div>
        ) : (
          <>
            <ul
              role="list"
              className="flex flex-wrap items-center gap-x-10 gap-y-4"
            >
              <li>
                <div className="flex items-center space-x-2">
                  <span
                    className="size-3 shrink-0 rounded-sm bg-blue-500"
                    aria-hidden={true}
                  />
                  <p className="font-semibold text-foreground">
                    {valueFormatter(totalVisitorsSum)}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">Total Visitors</p>
              </li>
              {hasRevenue && (
                <li>
                  <div className="flex items-center space-x-2">
                    <span
                      className="size-3 shrink-0 rounded-full bg-emerald-500"
                      aria-hidden={true}
                    />
                    <p className="font-semibold text-foreground">
                      $
                      {totalRevenueSum.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </li>
              )}
            </ul>
            {/* Desktop chart */}
            <div className="mt-10 hidden h-72 sm:block">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsAreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="visitorsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal
                    vertical={false}
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 12, fill: 'currentColor' }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={44}
                    tickFormatter={valueFormatter}
                    tick={{ fontSize: 12, fill: 'currentColor' }}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#visitorsGradient)"
                  />
                  {/* Revenue dots on top of the line */}
                  {chartData.map((point, index) =>
                    point.revenue > 0 ? (
                      <ReferenceDot
                        key={index}
                        x={point.date}
                        y={point.visitors}
                        r={6}
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ) : null,
                  )}
                </RechartsAreaChart>
              </ResponsiveContainer>
            </div>
            {/* Mobile chart */}
            <div className="mt-6 h-72 sm:hidden">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsAreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="visitorsGradientMobile"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal
                    vertical={false}
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 12, fill: 'currentColor' }}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#visitorsGradientMobile)"
                  />
                  {/* Revenue dots on top of the line */}
                  {chartData.map((point, index) =>
                    point.revenue > 0 ? (
                      <ReferenceDot
                        key={index}
                        x={point.date}
                        y={point.visitors}
                        r={5}
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ) : null,
                  )}
                </RechartsAreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}

// Helper function to format dates based on time range
function formatDate(timestamp: number, timeRange: string): string {
  const date = new Date(timestamp)
  if (timeRange === 'last_hour' || timeRange === 'today') {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
