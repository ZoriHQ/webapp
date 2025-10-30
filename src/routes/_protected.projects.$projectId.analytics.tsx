import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type {TimeRange} from '@/hooks/use-analytics';
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
  useVisitorsTimeline
} from '@/hooks/use-analytics'
import { useRevenueByOrigin } from '@/hooks/use-revenue'
import { useProject } from '@/hooks/use-projects'
import { usePaymentProviders } from '@/hooks/use-payment-providers'
import { ProjectHeader } from '@/components/analytics/project-header'
import { EngagementMetrics } from '@/components/analytics/engagement-metrics'
import { TrafficSources } from '@/components/analytics/traffic-sources'
import { RevenueAttributionByOrigin } from '@/components/revenue/revenue-attribution-by-origin'
import { BounceRateCard } from '@/components/analytics/bounce-rate-card'
import { TopVisitorsTable } from '@/components/analytics/top-visitors-table'
import { EmptyEventsState } from '@/components/analytics/empty-events-state'
import { VisitorProfileModal } from '@/components/analytics/visitor-profile-modal'

export const Route = createFileRoute('/_protected/projects/$projectId/analytics')({
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { projectId } = Route.useParams()
  const [timeRange, setTimeRange] = useState<TimeRange>('last_7_days')
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(
    null,
  )
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false)

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

  // Revenue data
  const { data: revenueByOriginData, isLoading: revenueLoading } =
    useRevenueByOrigin(projectId, timeRange)

  // Payment provider data
  const { data: providersData } = usePaymentProviders(projectId)
  const hasPaymentProvider = (providersData?.providers?.length || 0) > 0

  console.log('[ProjectDetailPage] Timeline query state:', {
    timelineData,
    isLoading: timelineLoading,
    error: timelineError,
    status: timelineStatus,
  })

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

            {/* Traffic Sources (Tabbed: Origin, Country) with Revenue */}
            <TrafficSources
              originData={originData?.data}
              countryData={countryData?.data}
              revenueByOrigin={revenueByOriginData?.data}
              isLoading={originLoading || countryLoading}
              showRevenue={hasPaymentProvider}
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

          {/* Revenue Attribution (only show if payment provider is connected) */}
          {hasPaymentProvider && (
            <div className="mb-8">
              <RevenueAttributionByOrigin
                data={revenueByOriginData}
                isLoading={revenueLoading}
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
