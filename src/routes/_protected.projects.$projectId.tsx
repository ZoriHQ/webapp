import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import {
  useRecentEvents,
  useVisitorsByCountry,
  useVisitorsByOrigin,
  useVisitorsTimeline,
  type TimeRange,
} from '@/hooks/use-analytics'
import { ProjectHeader } from '@/components/analytics/project-header'
import { MetricsOverview } from '@/components/analytics/metrics-overview'
import { RevenueAttribution } from '@/components/analytics/revenue-attribution'
import { TrafficByOrigin } from '@/components/analytics/traffic-by-origin'
import { TrafficByCountry } from '@/components/analytics/traffic-by-country'
import { LiveEventStream } from '@/components/analytics/live-event-stream'
import { VisitorProfileModal } from '@/components/analytics/visitor-profile-modal'

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
  console.log('[ProjectDetailPage] Timeline query state:', {
    timelineData,
    isLoading: timelineLoading,
    error: timelineError,
    status: timelineStatus
  })

  // Calculate overall stats from revenue data (mock for now)
  const totalVisitors = revenueBySource.reduce((sum, source) => sum + source.visitors, 0)
  const totalConversions = revenueBySource.reduce((sum, source) => sum + source.conversions, 0)
  const totalRevenue = revenueBySource.reduce((sum, source) => sum + source.revenue, 0)
  const revenuePerVisitor = totalRevenue / totalVisitors
  const averageOrderValue = totalRevenue / totalConversions
  const conversionRate = (totalConversions / totalVisitors) * 100

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
        totalVisitors={totalVisitors}
        totalRevenue={totalRevenue}
        totalConversions={totalConversions}
        revenuePerVisitor={revenuePerVisitor}
        averageOrderValue={averageOrderValue}
        conversionRate={conversionRate}
      />

      <RevenueAttribution
        revenueData={revenueBySource}
        hasData={hasRevenueData}
        showToggle={isDev}
        onToggle={() => setHasRevenueData(!hasRevenueData)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TrafficByOrigin data={originData?.data} isLoading={originLoading} />
        <TrafficByCountry data={countryData?.data} isLoading={countryLoading} />
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
