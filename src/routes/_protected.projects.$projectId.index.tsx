import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useProject } from '@/hooks/use-projects'
import { useAuth } from '@/lib/use-auth'
import {
  useVisitorsByCountry,
  useVisitorsTimeline,
  useVisitorsByOrigin,
  useDashboardMetrics,
  useChurnRate,
  type TimeRange,
} from '@/hooks/use-analytics'
import { usePaymentProviders } from '@/hooks/use-payment-providers'
import { ProjectOnboardingState } from '@/components/analytics/project-onboarding-state'
import { GlobeVisualization } from '@/components/overview/globe-visualization'
import { VisitorTimeline } from '@/components/overview/visitor-timeline'
import { TrafficSources } from '@/components/analytics/traffic-sources'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, TrendingUp, TrendingDown, DollarSign, Users, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/projects/$projectId/')({
  component: OverviewPage,
})

function OverviewPage() {
  const { projectId } = Route.useParams()
  const [timeRange, setTimeRange] = useState<TimeRange>('today')
  const { account } = useAuth()

  // Fetch project details
  const { data: projectData, isLoading: projectLoading } = useProject(projectId)

  // Fetch analytics data
  const { data: countryData, isLoading: countryLoading } = useVisitorsByCountry(
    projectId,
    timeRange,
  )
  const { data: timelineData, isLoading: timelineLoading } =
    useVisitorsTimeline(projectId, timeRange)
  const { data: originData, isLoading: originLoading } = useVisitorsByOrigin(
    projectId,
    timeRange,
  )
  const { data: metricsData, isLoading: metricsLoading } = useDashboardMetrics(
    projectId,
    timeRange,
  )
  const { data: churnData, isLoading: churnLoading } = useChurnRate(
    projectId,
    timeRange,
  )

  // Payment provider data
  const { data: providersData } = usePaymentProviders(projectId)
  const hasPaymentProvider = (providersData?.providers?.length || 0) > 0

  // Check if project has received any events
  const hasNoEvents = !projectData?.first_event_received_at && !projectLoading

  // Get user name
  const userName = (account as any)?.name?.split(' ')[0] || account?.email?.split('@')[0] || 'there'

  // Get current time for greeting
  const currentHour = new Date().getHours()
  let greeting = 'Good evening'
  if (currentHour < 12) {
    greeting = 'Good morning'
  } else if (currentHour < 18) {
    greeting = 'Good afternoon'
  }

  // Get current time
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  // Calculate today's metrics
  const todayVisits = metricsData?.unique_visitors || 0
  const todayRevenue = metricsData?.revenue || 0
  const churnRate = churnData?.churn_rate || 0

  return (
    <>
      {/* Show empty state if no events have been received */}
      {hasNoEvents ? (
        <ProjectOnboardingState
          projectId={projectId}
          projectToken={projectData?.project_token}
        />
      ) : (
        <div className="space-y-6">
          {/* Hero Section with Globe */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
            {/* Left side - Welcome and Stats */}
            <div className="space-y-8 pt-20">
              {/* Greeting */}
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight">
                  {greeting},
                </h1>
                <h2 className="text-4xl font-bold tracking-tight capitalize">
                  {userName}
                </h2>
                <p className="text-muted-foreground text-sm">
                  The time is {currentTime} at your location
                </p>
              </div>

              {/* Key Metrics Chips */}
              <div className="flex flex-wrap gap-2 max-w-md">
                {/* Payment Provider Warning or Revenue */}
                {!hasPaymentProvider ? (
                  <Link
                    to="/projects/$projectId/settings"
                    params={{ projectId }}
                    search={{ tab: 'integrations' }}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50 hover:bg-yellow-100 dark:hover:bg-yellow-950/50 transition-colors cursor-pointer">
                      <AlertCircle className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-500" />
                      <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                        Payment provider not connected
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
                    <DollarSign className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
                    <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                      ${todayRevenue.toLocaleString()}
                    </span>
                    <span className="text-xs text-green-600 dark:text-green-400">
                      revenue today
                    </span>
                  </div>
                )}

                {/* Total Visits Today */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
                  <Users className="h-3.5 w-3.5 text-blue-600 dark:text-blue-500" />
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                    {todayVisits.toLocaleString()}
                  </span>
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    visits today
                  </span>
                </div>

                {/* Churn Rate */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50">
                  <Activity className="h-3.5 w-3.5 text-purple-600 dark:text-purple-500" />
                  <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                    {churnRate.toFixed(1)}%
                  </span>
                  <span className="text-xs text-purple-600 dark:text-purple-400">
                    churn rate
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/projects/$projectId/analytics"
                  params={{ projectId }}
                >
                  <Button
                    variant="outline"
                    className="gap-2 hover:bg-primary/5 transition-colors"
                  >
                    <Activity className="h-4 w-4" />
                    Explore Analytics
                  </Button>
                </Link>

                {hasPaymentProvider && (
                  <Link
                    to="/projects/$projectId/analytics"
                    params={{ projectId }}
                  >
                    <Button
                      variant="outline"
                      className="gap-2 hover:bg-primary/5 transition-colors"
                    >
                      <DollarSign className="h-4 w-4" />
                      View Revenue
                    </Button>
                  </Link>
                )}

                <Link
                  to="/projects/$projectId/llm-traces"
                  params={{ projectId }}
                >
                  <Button
                    variant="outline"
                    className="gap-2 hover:bg-primary/5 transition-colors"
                  >
                    <Activity className="h-4 w-4" />
                    Check LLM Traces
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side - Globe */}
            <div className="lg:sticky lg:top-6">
              <GlobeVisualization
                countryData={countryData?.data}
                isLoading={countryLoading}
              />
            </div>
          </div>

          {/* Visitor Timeline and Traffic Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VisitorTimeline
              data={timelineData?.data}
              isLoading={timelineLoading}
              timeRange={timeRange}
            />
            <TrafficSources
              originData={originData?.data}
              countryData={countryData?.data}
              isLoading={originLoading || countryLoading}
            />
          </div>
        </div>
      )}
    </>
  )
}
