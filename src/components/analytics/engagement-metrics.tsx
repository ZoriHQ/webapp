import { useEffect, useState } from 'react'
import { IconSettings } from '@tabler/icons-react'
import { UniqueVisitorsTile } from './tiles/top-visitors.tile'
import { UniqueSessionsTile } from './tiles/unique-sessions.tile'
import { BounceRateTile } from './tiles/bounce-rate.tile'
import { SessionDurationTile } from './tiles/session-duration.tile'
import { PagesPerSessionTile } from './tiles/pages-per-session.tile'
import { ReturnRateTile } from './tiles/return-rate.tile'
import { TimeBetweenVisitsTile } from './tiles/time-between-visits.tile'
import type { MetricType } from '@/lib/metrics-config'
import {
  AVAILABLE_METRICS,
  loadMetricsPreferences,
  resetMetricsPreferences,
  saveMetricsPreferences,
} from '@/lib/metrics-config'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function EngagementMetrics() {
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

  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isEnabled('uniqueVisitors') && <UniqueVisitorsTile />}

        {isEnabled('totalSessions') && <UniqueSessionsTile />}

        {isEnabled('bounceRate') && <BounceRateTile />}

        {isEnabled('avgSessionDuration') && <SessionDurationTile />}

        {isEnabled('avgPagesPerSession') && <PagesPerSessionTile />}

        {isEnabled('returnRate') && <ReturnRateTile />}

        {isEnabled('avgTimeBetweenVisits') && <TimeBetweenVisitsTile />}
      </div>
    </div>
  )
}
