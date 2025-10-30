import { useEffect, useState } from 'react'
import {
  IconActivity,
  IconArrowBackUp,
  IconCheck,
  IconClock,
  IconFileText,
  IconPercentage,
  IconSettings,
  IconUserCheck,
  IconUserMinus,
  IconUsers,
} from '@tabler/icons-react'
import type Zoriapi from 'zorihq'
import type { MetricType } from '@/lib/metrics-config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AVAILABLE_METRICS,
  loadMetricsPreferences,
  resetMetricsPreferences,
  saveMetricsPreferences,
} from '@/lib/metrics-config'

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
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`
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
          <div className="text-2xl font-bold text-muted-foreground">
            Loading...
          </div>
        ) : (
          <>
            <div className={`text-2xl font-bold ${valueClassName || ''}`}>
              {value}
            </div>
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
  const [enabledMetrics, setEnabledMetrics] = useState<Array<MetricType>>([])

  useEffect(() => {
    setEnabledMetrics(loadMetricsPreferences())
  }, [])

  const handleToggleMetric = (metricId: MetricType) => {
    const newMetrics = enabledMetrics.includes(metricId)
      ? enabledMetrics.filter((id) => id !== metricId)
      : [...enabledMetrics, metricId]

    setEnabledMetrics(newMetrics)
    saveMetricsPreferences(newMetrics)
  }

  const handleReset = () => {
    resetMetricsPreferences()
    setEnabledMetrics(loadMetricsPreferences())
  }

  const isEnabled = (metricId: MetricType) => enabledMetrics.includes(metricId)

  // Check if metric has data before displaying
  const hasData = (metricId: MetricType): boolean => {
    switch (metricId) {
      case 'uniqueVisitors':
        return uniqueVisitors !== undefined
      case 'totalSessions':
        return totalSessions !== undefined
      case 'bounceRate':
        return bounceRate !== undefined
      case 'avgSessionDuration':
        return avgSessionDuration !== undefined
      case 'avgPagesPerSession':
        return avgPagesPerSession !== undefined
      case 'dau':
        return dau !== undefined
      case 'wau':
        return wau !== undefined
      case 'mau':
        return mau !== undefined
      case 'churnRate':
        return churnData !== undefined
      case 'returnRate':
        return returnData !== undefined
      case 'avgTimeBetweenVisits':
        return returnData?.avg_time_between_sessions_hours !== undefined
      default:
        return false
    }
  }

  return (
    <div className="space-y-4">
      {/* Header with Settings Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Key Metrics</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconSettings className="h-4 w-4 mr-2" />
              Configure Metrics
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Visible Metrics</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[400px] overflow-y-auto">
              {AVAILABLE_METRICS.map((metric) => (
                <DropdownMenuCheckboxItem
                  key={metric.id}
                  checked={isEnabled(metric.id)}
                  onCheckedChange={() => handleToggleMetric(metric.id)}
                  disabled={!hasData(metric.id)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{metric.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {metric.description}
                    </span>
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="w-full"
              >
                Reset to Defaults
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Unique Visitors */}
        {isEnabled('uniqueVisitors') && uniqueVisitors !== undefined && (
          <MetricCard
            title="Unique Visitors"
            icon={IconUsers}
            value={uniqueVisitors.toLocaleString()}
            subtitle="Unique visitors in period"
            isLoading={isLoading}
          />
        )}

        {/* Total Sessions */}
        {isEnabled('totalSessions') && totalSessions !== undefined && (
          <MetricCard
            title="Total Sessions"
            icon={IconActivity}
            value={totalSessions.toLocaleString()}
            subtitle="Total sessions tracked"
            isLoading={isLoading}
          />
        )}

        {/* Bounce Rate */}
        {isEnabled('bounceRate') && bounceRate !== undefined && (
          <MetricCard
            title="Bounce Rate"
            icon={IconPercentage}
            value={`${bounceRate.toFixed(1)}%`}
            subtitle="Single-page sessions"
            isLoading={isLoading}
          />
        )}

        {/* Avg Session Duration */}
        {isEnabled('avgSessionDuration') &&
          avgSessionDuration !== undefined && (
            <MetricCard
              title="Avg Session Duration"
              icon={IconClock}
              value={formatDuration(avgSessionDuration)}
              subtitle="Average time on site"
              isLoading={isLoading}
            />
          )}

        {/* Pages per Session */}
        {isEnabled('avgPagesPerSession') &&
          avgPagesPerSession !== undefined && (
            <MetricCard
              title="Pages / Session"
              icon={IconFileText}
              value={avgPagesPerSession.toFixed(1)}
              subtitle="Average pages viewed"
              isLoading={isLoading}
            />
          )}

        {/* Daily Active Users */}
        {isEnabled('dau') && dau !== undefined && (
          <MetricCard
            title="Daily Active Users"
            icon={IconUserCheck}
            value={dau.toLocaleString()}
            subtitle="Unique users today"
            isLoading={isLoading}
          />
        )}

        {/* Weekly Active Users */}
        {isEnabled('wau') && wau !== undefined && (
          <MetricCard
            title="Weekly Active Users"
            icon={IconUserCheck}
            value={wau.toLocaleString()}
            subtitle="Unique users this week"
            isLoading={isLoading}
          />
        )}

        {/* Monthly Active Users */}
        {isEnabled('mau') && mau !== undefined && (
          <MetricCard
            title="Monthly Active Users"
            icon={IconUserCheck}
            value={mau.toLocaleString()}
            subtitle="Unique users this month"
            isLoading={isLoading}
          />
        )}

        {/* Churn Rate */}
        {isEnabled('churnRate') && churnData && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
              <IconUserMinus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-2xl font-bold text-muted-foreground">
                  Loading...
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {churnData.churn_rate_percent?.toFixed(1) || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {churnData.churned_users?.toLocaleString() || 0} of{' '}
                    {churnData.total_users?.toLocaleString() || 0} users churned
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Return Rate */}
        {isEnabled('returnRate') && returnData && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
              <IconArrowBackUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-2xl font-bold text-muted-foreground">
                  Loading...
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {returnData.return_rate_percent?.toFixed(1) || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {returnData.returning_users?.toLocaleString() || 0} of{' '}
                    {returnData.total_users?.toLocaleString() || 0} users return
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Avg Time Between Visits */}
        {isEnabled('avgTimeBetweenVisits') &&
          returnData?.avg_time_between_sessions_hours !== undefined && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Time Between Visits
                </CardTitle>
                <IconClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-2xl font-bold text-muted-foreground">
                    Loading...
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {formatHours(returnData.avg_time_between_sessions_hours)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Average return interval
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  )
}
