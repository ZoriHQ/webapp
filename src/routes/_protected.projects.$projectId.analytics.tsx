import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import {
  useActiveUsers,
  useBounceRate,
  useChurnRate,
  useDashboardMetrics,
  useReturnRate,
  useTopVisitors,
  useVisitorsByCountry,
  useVisitorsByOrigin,
  useVisitorsTimeline,
  type TimeRange,
} from '@/hooks/use-analytics'
import { useProject } from '@/hooks/use-projects'
import { ProjectHeader } from '@/components/analytics/project-header'
import { EngagementMetrics } from '@/components/analytics/engagement-metrics'
import { TrafficSources } from '@/components/analytics/traffic-sources'
import { RevenueAttribution } from '@/components/analytics/revenue-attribution'
import { BounceRateCard } from '@/components/analytics/bounce-rate-card'
import { TopVisitorsTable } from '@/components/analytics/top-visitors-table'
import { EmptyEventsState } from '@/components/analytics/empty-events-state'
import { VisitorProfileModal } from '@/components/analytics/visitor-profile-modal'

export const Route = createFileRoute('/_protected/projects/$projectId/analytics')({
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
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(
    null,
  )
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false)
  const isDev = import.meta.env.DEV

  // Fetch project details
  const { data: projectData, isLoading: projectLoading } = useProject(projectId)

  // Fetch analytics data
  console.log('[ProjectDetailPage] Component rendered with:', {
    projectId,
    timeRange,
  })
  const { data: countryData, isLoading: countryLoading } = useVisitorsByCountry(
    projectId,
    timeRange,
  )
  const { data: originData, isLoading: originLoading } = useVisitorsByOrigin(
    projectId,
    timeRange,
  )
  const {
    data: timelineData,
    isLoading: timelineLoading,
    error: timelineError,
    status: timelineStatus,
  } = useVisitorsTimeline(projectId, timeRange)

  // New metrics hooks
  const { data: dashboardData, isLoading: dashboardLoading } =
    useDashboardMetrics(projectId, timeRange)
  const { data: activeUsersData, isLoading: activeUsersLoading } =
    useActiveUsers(projectId)
  const { data: bounceRateData, isLoading: bounceRateLoading } = useBounceRate(
    projectId,
    timeRange,
    10,
  )
  const { data: churnData, isLoading: churnLoading } = useChurnRate(
    projectId,
    timeRange,
  )
  const { data: returnData, isLoading: returnLoading } = useReturnRate(
    projectId,
    timeRange,
  )
  const { data: topVisitorsData, isLoading: topVisitorsLoading } =
    useTopVisitors(projectId, timeRange, 20)

  console.log('[ProjectDetailPage] Timeline query state:', {
    timelineData,
    isLoading: timelineLoading,
    error: timelineError,
    status: timelineStatus,
  })

  // Mock revenue data - only used for dev demo (can be removed)
  // These are not passed to the new MetricsOverview component

  // Check if project has received any events based on first_event_received_at field
  const hasNoEvents = !projectData?.first_event_received_at && !projectLoading

  const handleVisitorClick = (visitorId: string) => {
    setSelectedVisitorId(visitorId)
    setIsVisitorModalOpen(true)
  }

  return (
    <>
      <ProjectHeader
        projectName={projectData?.name}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      {/* Show empty state if no events have been received */}
      {hasNoEvents ? (
        <EmptyEventsState
          projectId={projectId}
          projectName={projectData?.name}
        />
      ) : (
        <>
          {/* Engagement Metrics Cards */}
          <div className="mb-8">
            <EngagementMetrics
              uniqueVisitors={dashboardData?.unique_visitors}
              totalSessions={dashboardData?.total_sessions_in_period}
              bounceRate={dashboardData?.bounce_rate}
              avgSessionDuration={dashboardData?.avg_session_duration_seconds}
              avgPagesPerSession={dashboardData?.avg_pages_per_session}
              dau={activeUsersData?.dau}
              wau={activeUsersData?.wau}
              mau={activeUsersData?.mau}
              churnData={churnData}
              returnData={returnData}
              isLoading={
                dashboardLoading ||
                activeUsersLoading ||
                churnLoading ||
                returnLoading
              }
            />
          </div>

          {/* Chart + Traffic Sources Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-8">
            {/* Chart with key metrics */}
            <ChartAreaInteractive
              data={timelineData?.data}
              isLoading={timelineLoading}
              timeRange={timeRange}
            />

            {/* Traffic Sources (Tabbed: Origin, Country) */}
            <TrafficSources
              originData={originData?.data}
              countryData={countryData?.data}
              isLoading={originLoading || countryLoading}
            />
          </div>

          {/* Bounce Rate Analysis */}
          <div className="mb-8">
            <BounceRateCard
              data={bounceRateData}
              isLoading={bounceRateLoading}
            />
          </div>

          {/* Top Visitors */}
          <div className="mb-8">
            <TopVisitorsTable
              data={topVisitorsData}
              isLoading={topVisitorsLoading}
              onVisitorClick={handleVisitorClick}
            />
          </div>

          {/* Revenue Attribution (mock data - dev only) */}
          {isDev && (
            <div className="mb-8">
              <RevenueAttribution
                revenueData={revenueBySource}
                hasData={hasRevenueData}
                showToggle={isDev}
                onToggle={() => setHasRevenueData(!hasRevenueData)}
              />
            </div>
          )}
        </>
      )}

      <VisitorProfileModal
        projectId={projectId}
        visitorId={selectedVisitorId}
        open={isVisitorModalOpen}
        onOpenChange={setIsVisitorModalOpen}
      />
    </>
  )
}
