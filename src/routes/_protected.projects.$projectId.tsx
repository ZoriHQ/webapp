import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import {
  useRecentEvents,
  useVisitorsByCountry,
  useVisitorsByOrigin,
  useVisitorsTimeline,
  useDashboardMetrics,
  useActiveUsers,
  useBounceRate,
  useChurnRate,
  useReturnRate,
  useTopVisitors,
  type TimeRange,
} from '@/hooks/use-analytics'
import { ProjectHeader } from '@/components/analytics/project-header'
import { MetricsOverview } from '@/components/analytics/metrics-overview'
import { RevenueAttribution } from '@/components/analytics/revenue-attribution'
import { TrafficByOrigin } from '@/components/analytics/traffic-by-origin'
import { TrafficByCountry } from '@/components/analytics/traffic-by-country'
import { LiveEventStream } from '@/components/analytics/live-event-stream'
import { VisitorProfileModal } from '@/components/analytics/visitor-profile-modal'
import { BounceRateCard } from '@/components/analytics/bounce-rate-card'
import { RetentionMetrics } from '@/components/analytics/retention-metrics'
import { TopVisitorsTable } from '@/components/analytics/top-visitors-table'

export const Route = createFileRoute('/_protected/projects/$projectId')({
  component: ProjectDetailPage,
})

// Mock data for revenue attribution (will be replaced with real API later)
const revenueBySource = [
  {
    source: 'Google Organic',
    visitors: 2341,
    conversions: 156,
    revenue: 12450,
    averageValue: 79.81,
  },
  {
    source: 'Reddit - r/programming',
    visitors: 1245,
    conversions: 89,
    revenue: 8900,
    averageValue: 100.0,
  },
  {
    source: 'Twitter',
    visitors: 1567,
    conversions: 67,
    revenue: 5360,
    averageValue: 80.0,
  },
  {
    source: 'Direct Traffic',
    visitors: 3245,
    conversions: 134,
    revenue: 10720,
    averageValue: 80.0,
  },
  {
    source: 'Google Ads',
    visitors: 892,
    conversions: 71,
    revenue: 5680,
    averageValue: 80.0,
  },
  {
    source: 'Reddit - r/webdev',
    visitors: 892,
    conversions: 34,
    revenue: 2720,
    averageValue: 80.0,
  },
]

function ProjectDetailPage() {
  const { projectId } = Route.useParams()
  const [timeRange, setTimeRange] = useState<TimeRange>('last_7_days')
  const [hasRevenueData, setHasRevenueData] = useState(true)
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null)
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false)
  const isDev = import.meta.env.DEV

  const handleVisitorClick = (visitorId: string) => {
    setSelectedVisitorId(visitorId)
    setIsVisitorModalOpen(true)
  }

  // Fetch analytics data
  console.log('[ProjectDetailPage] Component rendered with:', { projectId, timeRange })
  const { data: recentEventsData, isLoading: eventsLoading } = useRecentEvents(projectId, 15)
  const { data: countryData, isLoading: countryLoading } = useVisitorsByCountry(projectId, timeRange)
  const { data: originData, isLoading: originLoading } = useVisitorsByOrigin(projectId, timeRange)
  const { data: timelineData, isLoading: timelineLoading, error: timelineError, status: timelineStatus } = useVisitorsTimeline(projectId, timeRange)

  // New metrics hooks
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboardMetrics(projectId, timeRange)
  const { data: activeUsersData, isLoading: activeUsersLoading } = useActiveUsers(projectId)
  const { data: bounceRateData, isLoading: bounceRateLoading } = useBounceRate(projectId, timeRange, 10)
  const { data: churnData, isLoading: churnLoading } = useChurnRate(projectId, timeRange)
  const { data: returnData, isLoading: returnLoading } = useReturnRate(projectId, timeRange)
  const { data: topVisitorsData, isLoading: topVisitorsLoading } = useTopVisitors(projectId, timeRange, 20)

  console.log('[ProjectDetailPage] Timeline query state:', {
    timelineData,
    isLoading: timelineLoading,
    error: timelineError,
    status: timelineStatus
  })

  // Mock revenue data - only used for dev demo (can be removed)
  // These are not passed to the new MetricsOverview component

  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectHeader
        projectId={projectId}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      <div className="mb-8">
        <ChartAreaInteractive
          data={timelineData?.data}
          isLoading={timelineLoading}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      </div>

      <MetricsOverview
        uniqueVisitors={dashboardData?.unique_visitors}
        totalSessions={dashboardData?.total_sessions_in_period}
        bounceRate={dashboardData?.bounce_rate}
        avgSessionDuration={dashboardData?.avg_session_duration_seconds}
        avgPagesPerSession={dashboardData?.avg_pages_per_session}
        dau={activeUsersData?.dau}
        wau={activeUsersData?.wau}
        mau={activeUsersData?.mau}
        isLoading={dashboardLoading || activeUsersLoading}
      />

      {/* Retention Metrics Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">User Retention</h2>
        <RetentionMetrics
          churnData={churnData}
          returnData={returnData}
          isLoading={churnLoading || returnLoading}
        />
      </div>

      {/* Bounce Rate Section */}
      <div className="mb-8">
        <BounceRateCard data={bounceRateData} isLoading={bounceRateLoading} />
      </div>

      {/* Revenue Attribution (mock data - can be hidden or removed) */}
      {isDev && (
        <RevenueAttribution
          revenueData={revenueBySource}
          hasData={hasRevenueData}
          showToggle={isDev}
          onToggle={() => setHasRevenueData(!hasRevenueData)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TrafficByOrigin data={originData?.data} isLoading={originLoading} />
        <TrafficByCountry data={countryData?.data} isLoading={countryLoading} />
      </div>

      {/* Top Visitors */}
      <div className="mb-8">
        <TopVisitorsTable
          data={topVisitorsData}
          isLoading={topVisitorsLoading}
          onVisitorClick={handleVisitorClick}
        />
      </div>

      <LiveEventStream
        events={recentEventsData?.events}
        isLoading={eventsLoading}
        onVisitorClick={handleVisitorClick}
      />

      <VisitorProfileModal
        projectId={projectId}
        visitorId={selectedVisitorId}
        open={isVisitorModalOpen}
        onOpenChange={setIsVisitorModalOpen}
      />
    </div>
  )
}
