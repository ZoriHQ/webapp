import type Zoriapi from 'zorihq'
import {
  IconUsers,
  IconActivity,
  IconPercentage,
  IconClock,
  IconFileText,
  IconUserCheck,
  IconArrowBackUp,
  IconUserMinus,
} from '@tabler/icons-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface EngagementMetricsProps {
  // Session-based metrics
  uniqueVisitors?: number
  totalSessions?: number
  bounceRate?: number
  avgSessionDuration?: number
  avgPagesPerSession?: number

  // Active users
  dau?: number
  wau?: number
  mau?: number

  // Retention metrics
  churnData?: Zoriapi.V1.Analytics.ChurnRateResponse
  returnData?: Zoriapi.V1.Analytics.ReturnRateResponse

  isLoading?: boolean
}

function formatDuration(seconds: number | undefined): string {
  if (seconds === undefined) return '0s'

  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)

  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
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

function MetricCard({
  title,
  icon: Icon,
  value,
  subtitle,
  isLoading,
  valueClassName,
}: {
  title: string
  icon: React.ElementType
  value: string | number
  subtitle: string
  isLoading?: boolean
  valueClassName?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
        ) : (
          <>
            <div className={`text-2xl font-bold ${valueClassName || ''}`}>{value}</div>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function EngagementMetrics({
  uniqueVisitors,
  totalSessions,
  bounceRate,
  avgSessionDuration,
  avgPagesPerSession,
  dau,
  wau,
  mau,
  churnData,
  returnData,
  isLoading = false,
}: EngagementMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sessions" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="retention">Retention</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {uniqueVisitors !== undefined && (
                <MetricCard
                  title="Unique Visitors"
                  icon={IconUsers}
                  value={uniqueVisitors.toLocaleString()}
                  subtitle="Unique visitors in period"
                  isLoading={isLoading}
                />
              )}

              {totalSessions !== undefined && (
                <MetricCard
                  title="Total Sessions"
                  icon={IconActivity}
                  value={totalSessions.toLocaleString()}
                  subtitle="Total sessions tracked"
                  isLoading={isLoading}
                />
              )}

              {bounceRate !== undefined && (
                <MetricCard
                  title="Bounce Rate"
                  icon={IconPercentage}
                  value={`${bounceRate.toFixed(1)}%`}
                  subtitle="Single-page sessions"
                  isLoading={isLoading}
                />
              )}

              {avgSessionDuration !== undefined && (
                <MetricCard
                  title="Avg Session Duration"
                  icon={IconClock}
                  value={formatDuration(avgSessionDuration)}
                  subtitle="Average time on site"
                  isLoading={isLoading}
                />
              )}

              {avgPagesPerSession !== undefined && (
                <MetricCard
                  title="Pages / Session"
                  icon={IconFileText}
                  value={avgPagesPerSession.toFixed(1)}
                  subtitle="Average pages viewed"
                  isLoading={isLoading}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dau !== undefined && (
                <MetricCard
                  title="Daily Active Users"
                  icon={IconUserCheck}
                  value={dau.toLocaleString()}
                  subtitle="Unique users today"
                  isLoading={isLoading}
                />
              )}

              {wau !== undefined && (
                <MetricCard
                  title="Weekly Active Users"
                  icon={IconUserCheck}
                  value={wau.toLocaleString()}
                  subtitle="Unique users this week"
                  isLoading={isLoading}
                />
              )}

              {mau !== undefined && (
                <MetricCard
                  title="Monthly Active Users"
                  icon={IconUserCheck}
                  value={mau.toLocaleString()}
                  subtitle="Unique users this month"
                  isLoading={isLoading}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="retention" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <p className="text-xs text-muted-foreground mt-1">Average return interval</p>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">No data</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
