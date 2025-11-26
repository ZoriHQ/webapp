import { format } from 'date-fns'
import type Zoriapi from 'zorihq'

import { AreaChart } from '@/components/ui/area-chart'
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
      dateFormatted: formatXAxis(item.timestamp || '', timeRange),
      revenue: (item.total_revenue || 0) / 100, // Convert from cents to dollars
      payments: item.payment_count || 0,
    })) || []

  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{
      value: number
      name: string
      payload: Record<string, unknown>
    }>
    label?: string
  }) => {
    if (!active || !payload?.[0]) return null

    const dataPoint = payload[0].payload
    const timestamp = dataPoint.timestamp as string
    const revenue = (dataPoint.revenue as number) || 0
    const payments = (dataPoint.payments as number) || 0

    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {format(new Date(timestamp), 'PPp')}
          </p>
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
            Revenue: ${revenue.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">Payments: {payments}</p>
        </div>
      </div>
    )
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
          <AreaChart
            className="h-[300px]"
            data={chartData}
            index="dateFormatted"
            categories={['revenue']}
            colors={['emerald']}
            valueFormatter={(value) => `$${value.toFixed(2)}`}
            showLegend={false}
            customTooltip={CustomTooltip}
          />
        )}
      </CardContent>
    </Card>
  )
}

function formatXAxis(timestamp: string, timeRange: string): string {
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
