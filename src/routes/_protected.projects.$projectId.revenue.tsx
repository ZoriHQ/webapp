import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import type { TimeRange } from '@/hooks/use-revenue'
import {
  useConversionMetrics,
  useRevenueByOrigin,
  useRevenueDashboard,
  useRevenueTimeline,
  useTopCustomers,
} from '@/hooks/use-revenue'
import { useProject } from '@/hooks/use-projects'
import { usePaymentProviders } from '@/hooks/use-payment-providers'
import { ProjectHeader } from '@/components/analytics/project-header'
import { RevenueDashboardMetrics } from '@/components/revenue/revenue-dashboard-metrics'
import { RevenueTimelineChart } from '@/components/revenue/revenue-timeline-chart'
import { RevenueAttributionByOrigin } from '@/components/revenue/revenue-attribution-by-origin'
import { TopCustomersTable } from '@/components/revenue/top-customers-table'
import { ConversionMetricsCard } from '@/components/revenue/conversion-metrics-card'
import { CustomerProfileModal } from '@/components/revenue/customer-profile-modal'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_protected/projects/$projectId/revenue')(
  {
    component: RevenuePage,
  },
)

function RevenuePage() {
  const { projectId } = Route.useParams()
  const [timeRange, setTimeRange] = useState<TimeRange>('last_7_days')
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  )
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)

  // Fetch project details
  const { data: projectData } = useProject(projectId)

  // Fetch revenue data
  const { data: dashboardData, isLoading: dashboardLoading } =
    useRevenueDashboard(projectId, timeRange)
  const { data: timelineData, isLoading: timelineLoading } = useRevenueTimeline(
    projectId,
    timeRange,
  )
  const { data: attributionData, isLoading: attributionLoading } =
    useRevenueByOrigin(projectId, timeRange)
  const { data: topCustomersData, isLoading: topCustomersLoading } =
    useTopCustomers(projectId, timeRange, 20)
  const { data: conversionData, isLoading: conversionLoading } =
    useConversionMetrics(projectId, timeRange)

  // Check payment provider status
  const { data: providersData } = usePaymentProviders(projectId)
  const hasPaymentProvider = (providersData?.providers?.length || 0) > 0

  const handleCustomerClick = (visitorId: string) => {
    setSelectedCustomerId(visitorId)
    setIsCustomerModalOpen(true)
  }

  return (
    <>
      <ProjectHeader
        projectName={projectData?.name}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      {/* Payment Provider Warning */}
      {!hasPaymentProvider && (
        <Card className="mb-8 border-yellow-200 dark:border-yellow-900/50 bg-yellow-50 dark:bg-yellow-950/30">
          <CardContent className="flex items-start gap-4 py-4">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                Payment Provider Not Connected
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                To start tracking revenue, connect a payment provider like
                Stripe or LemonSqueezy in your project settings. Once connected,
                revenue data will automatically appear here.
              </p>
              <Link
                to="/projects/$projectId/settings"
                params={{ projectId }}
                search={{ tab: 'integrations' }}
              >
                <Button size="sm" variant="outline">
                  Go to Integrations
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Metrics */}
      <div className="mb-8">
        <RevenueDashboardMetrics
          data={dashboardData}
          isLoading={dashboardLoading}
        />
      </div>

      {/* Conversion Metrics */}
      <div className="mb-8">
        <ConversionMetricsCard
          data={conversionData}
          isLoading={conversionLoading}
        />
      </div>

      {/* Revenue Timeline */}
      <div className="mb-8">
        <RevenueTimelineChart
          data={timelineData}
          isLoading={timelineLoading}
          timeRange={timeRange}
        />
      </div>

      {/* Revenue Attribution by Origin */}
      <div className="mb-8">
        <RevenueAttributionByOrigin
          data={attributionData}
          isLoading={attributionLoading}
        />
      </div>

      {/* Top Customers */}
      <div className="mb-8">
        <TopCustomersTable
          data={topCustomersData}
          isLoading={topCustomersLoading}
          onCustomerClick={handleCustomerClick}
        />
      </div>

      {/* Customer Profile Modal */}
      <CustomerProfileModal
        projectId={projectId}
        visitorId={selectedCustomerId}
        open={isCustomerModalOpen}
        onOpenChange={setIsCustomerModalOpen}
      />
    </>
  )
}
