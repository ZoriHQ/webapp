import {
  IconArrowBackUp,
  IconClock,
  IconUserMinus,
} from '@tabler/icons-react'
import type Zoriapi from 'zorihq'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RetentionMetricsProps {
  churnData: Zoriapi.V1.Analytics.ChurnRateResponse | undefined
  returnData: Zoriapi.V1.Analytics.ReturnRateResponse | undefined
  isLoading: boolean
}

function formatHours(hours: number | undefined): string {
  if (hours === undefined) return 'N/A'

  if (hours < 1) {
    return `${Math.round(hours * 60)}m`
  }

  if (hours < 24) {
    return `${hours.toFixed(1)}h`
  }

  const days = Math.floor(hours / 24)
  const remainingHours = Math.round(hours % 24)
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
}

export function RetentionMetrics({ churnData, returnData, isLoading }: RetentionMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Churn Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
          <IconUserMinus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
          ) : churnData ? (
            <>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {churnData.churn_rate_percent?.toFixed(1) || 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {churnData.churned_users?.toLocaleString() || 0} of{' '}
                {churnData.total_users?.toLocaleString() || 0} users churned
              </p>
              {churnData.churn_threshold_days && (
                <p className="text-xs text-muted-foreground mt-1">
                  ({churnData.churn_threshold_days} days inactivity)
                </p>
              )}
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>

      {/* Return Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
          <IconArrowBackUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
          ) : returnData ? (
            <>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {returnData.return_rate_percent?.toFixed(1) || 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {returnData.returning_users?.toLocaleString() || 0} of{' '}
                {returnData.total_users?.toLocaleString() || 0} users return
              </p>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>

      {/* Average Time Between Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Time Between Visits</CardTitle>
          <IconClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
          ) : returnData?.avg_time_between_sessions_hours !== undefined ? (
            <>
              <div className="text-2xl font-bold">
                {formatHours(returnData.avg_time_between_sessions_hours)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Average return interval
              </p>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
