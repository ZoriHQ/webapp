import {
  IconActivity,
  IconCash,
  IconClock,
  IconFileText,
  IconPercentage,
  IconTrendingUp,
  IconUserCheck,
  IconUsers,
} from '@tabler/icons-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MetricsOverviewProps {
  // Session-based metrics (from dashboard API)
  uniqueVisitors?: number
  totalSessions?: number
  bounceRate?: number
  avgSessionDuration?: number
  avgPagesPerSession?: number

  // Active users
  dau?: number
  wau?: number
  mau?: number

  // Revenue metrics (optional - for e-commerce tracking)
  totalRevenue?: number
  totalConversions?: number
  revenuePerVisitor?: number
  averageOrderValue?: number
  conversionRate?: number

  // Loading state
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

export function MetricsOverview({
  uniqueVisitors,
  totalSessions,
  bounceRate,
  avgSessionDuration,
  avgPagesPerSession,
  dau,
  wau,
  mau,
  totalRevenue,
  totalConversions,
  revenuePerVisitor,
  conversionRate,
  isLoading = false,
}: MetricsOverviewProps) {
  const hasRevenueMetrics = totalRevenue !== undefined || totalConversions !== undefined

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Unique Visitors */}
      {uniqueVisitors !== undefined && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {uniqueVisitors.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Unique visitors in period
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Total Sessions */}
      {totalSessions !== undefined && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <IconActivity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {totalSessions.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total sessions tracked
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bounce Rate */}
      {bounceRate !== undefined && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <IconPercentage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {bounceRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Single-page sessions
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Average Session Duration */}
      {avgSessionDuration !== undefined && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatDuration(avgSessionDuration)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Average time on site
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Average Pages Per Session */}
      {avgPagesPerSession !== undefined && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pages / Session</CardTitle>
            <IconFileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {avgPagesPerSession.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Average pages viewed
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* DAU/WAU/MAU */}
      {(dau !== undefined || wau !== undefined || mau !== undefined) && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <IconUserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
            ) : (
              <>
                <div className="flex gap-4 items-baseline">
                  {dau !== undefined && (
                    <div>
                      <div className="text-2xl font-bold">{dau.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">DAU</p>
                    </div>
                  )}
                  {wau !== undefined && (
                    <div>
                      <div className="text-lg font-semibold text-muted-foreground">{wau.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">WAU</p>
                    </div>
                  )}
                  {mau !== undefined && (
                    <div>
                      <div className="text-lg font-semibold text-muted-foreground">{mau.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">MAU</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Revenue metrics - only show if data is available */}
      {hasRevenueMetrics && (
        <>
          {/* Total Revenue */}
          {totalRevenue !== undefined && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <IconCash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {totalConversions ? `From ${totalConversions} payments` : 'Total earnings'}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Revenue Per Visitor */}
          {revenuePerVisitor !== undefined && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenue Per Visitor
                </CardTitle>
                <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      ${revenuePerVisitor.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Average value per visitor
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Conversion Rate */}
          {conversionRate !== undefined && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <IconPercentage className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{conversionRate.toFixed(2)}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Visitors to customers
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
