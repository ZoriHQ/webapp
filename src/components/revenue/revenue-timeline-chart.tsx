import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format } from 'date-fns'
import type Zoriapi from 'zorihq'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RevenueTimelineChartProps {
  data: Zoriapi.V1.Revenue.TimelineResponse | undefined
  isLoading: boolean
  timeRange: string
}

export function RevenueTimelineChart({
  data,
  isLoading,
  timeRange,
}: RevenueTimelineChartProps) {
  const chartData =
    data?.data?.map((item) => ({
      timestamp: item.timestamp || '',
      revenue: (item.total_revenue || 0) / 100, // Convert from cents to dollars
      payments: item.payment_count || 0,
    })) || []

  const formatXAxis = (timestamp: string) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)

    if (timeRange === 'last_hour' || timeRange === 'today') {
      return format(date, 'HH:mm')
    } else if (timeRange === 'last_7_days') {
      return format(date, 'EEE')
    } else {
      return format(date, 'MMM d')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-sm text-muted-foreground">
              Loading revenue timeline...
            </p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-sm text-muted-foreground">
              No revenue data available for this time period
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                className="text-xs"
                stroke="currentColor"
              />
              <YAxis
                className="text-xs"
                stroke="currentColor"
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(data.timestamp), 'PPp')}
                        </p>
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                          Revenue: ${data.revenue.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Payments: {data.payments}
                        </p>
                      </div>
                    </div>
                  )
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
