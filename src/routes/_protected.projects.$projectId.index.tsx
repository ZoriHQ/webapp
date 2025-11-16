import { useEffect } from 'react'
import { Activity, AlertCircle, DollarSign } from 'lucide-react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useProject } from '@/hooks/use-projects'
import { useAuthState } from '@/lib/auth'

import { usePaymentProviders } from '@/hooks/use-payment-providers'
import { ProjectOnboardingState } from '@/components/analytics/project-onboarding-state'
import { GlobeVisualization } from '@/components/overview/globe-visualization'
import { VisitorTimeline } from '@/components/overview/visitor-timeline'
import { TrafficSourcesJoinedTile } from '@/components/analytics/tiles/traffic-sources.joined-tile'
import { RevenueChip } from '@/components/analytics/chips/revenue-chip'
import { VisitorsChip } from '@/components/analytics/chips/visitors-chip'
import { ChurnChip } from '@/components/analytics/chips/churn-chip'

import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_protected/projects/$projectId/')({
  component: OverviewPage,
})

function OverviewPage() {
  const { projectId } = Route.useParams()
  const { user } = useAuthState()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const status = searchParams.get('status')
    const provider = searchParams.get('provider')
    const error = searchParams.get('error')

    if (status && provider) {
      // Show toast notification
      if (status === 'success') {
        toast.success(
          `Successfully connected ${provider.charAt(0).toUpperCase() + provider.slice(1)} and started backfill`,
        )
      } else if (status === 'error') {
        const errorMessage = error
          ? `: ${decodeURIComponent(error)}`
          : '. Please try again.'
        toast.error(
          `Failed to connect ${provider.charAt(0).toUpperCase() + provider.slice(1)}${errorMessage}`,
        )
      }

      // Clean up URL by removing query params
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [])

  // Fetch project details
  const { data: projectData, isLoading: projectLoading } = useProject(projectId)

  const { data: providersData } = usePaymentProviders(projectId)
  const hasPaymentProvider = (providersData?.providers?.length || 0) > 0

  const hasNoEvents = !projectData?.first_event_received_at && !projectLoading

  const userName = user?.name.split(' ')[0] || 'there'
  const currentHour = new Date().getHours()
  let greeting = 'Good evening'
  if (currentHour < 12) {
    greeting = 'Good morning'
  } else if (currentHour < 18) {
    greeting = 'Good afternoon'
  }

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <>
      {hasNoEvents ? (
        <ProjectOnboardingState
          projectId={projectId}
          projectToken={projectData?.project_token}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-1/2 space-y-8 pt-20 lg:pl-12 xl:pl-16">
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

              <div className="flex flex-wrap gap-2 max-w-md">
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
                  <RevenueChip projectId={projectId} />
                )}

                <VisitorsChip projectId={projectId} />

                <ChurnChip projectId={projectId} />
              </div>

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
                    to="/projects/$projectId/revenue"
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

            <div className="w-full lg:w-1/2 lg:sticky lg:top-6">
              <GlobeVisualization />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VisitorTimeline />
            <TrafficSourcesJoinedTile />
          </div>
        </div>
      )}
    </>
  )
}
