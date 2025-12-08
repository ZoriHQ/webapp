import { useMemo, useState } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'

import { AreaChart } from '@/components/ui/area-chart'
import { BarList } from '@/components/ui/bar-list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useAppContext } from '@/contexts/app.context'
import { useVisitorsTimeline } from '@/hooks/use-analytics'
import {
  useTopEntryPagesTile,
  useTopUniqueVisitorsTile,
  useTrafficByReferrerTile,
} from '@/hooks/use-analytics-tiles'
import { useLiveVisitors } from '@/hooks/use-live-visitors'

interface ModalState {
  open: boolean
  category: 'pages' | 'sources'
}

const valueFormatter = (value: number) =>
  Intl.NumberFormat('en-US').format(value)

// Helper to format large numbers compactly
const formatCompact = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

// Helper function to format dates based on time range
function formatDate(timestamp: number, timeRange: string): string {
  const date = new Date(timestamp)
  if (timeRange === 'last_hour' || timeRange === 'today') {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

// Helper to trim page paths
const trimPagePath = (path: string, maxLength: number = 35): string => {
  if (path.length <= maxLength) return path
  const start = path.slice(0, Math.floor(maxLength * 0.4))
  const end = path.slice(-Math.floor(maxLength * 0.5))
  return `${start}...${end}`
}

/**
 * Visitor Timeline Chart - Tremor-style chart with tabs
 */
export function VisitorTimelineChart() {
  const { storedValues } = useAppContext()

  const projectId = storedValues!.projectId as string
  const params = {
    project_id: projectId,
    time_range: storedValues?.timeRange || 'last_7_days',
  }

  const { data: timelineData, isLoading: isTimelineLoading } =
    useVisitorsTimeline(params)
  const { data: visitorsData, isLoading: isVisitorsLoading } =
    useTopUniqueVisitorsTile(params)
  const { liveCount, isConnected } = useLiveVisitors(projectId)

  // Process chart data
  const chartData = useMemo(() => {
    if (!timelineData?.data) return []

    return timelineData.data.map((item) => {
      const timestamp = item.time_bucket
        ? new Date(item.time_bucket).getTime()
        : 0

      const desktop =
        (item.num_desktop_visits ?? 0) + (item.num_unknown_visits ?? 0)
      const mobile = item.num_mobile_visits ?? 0
      const totalVisitors = desktop + mobile
      const revenue = (item.num_revenue ?? 0) / 100

      return {
        date: formatDate(timestamp, storedValues!.timeRange),
        'Unique visitors': totalVisitors,
        Revenue: revenue,
      }
    })
  }, [timelineData, storedValues])

  // Calculate totals
  const totalVisitors = visitorsData?.count ?? 0

  // Calculate total revenue for the period
  const totalRevenue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.Revenue, 0)
  }, [chartData])

  // Create revenue dots for chart markers
  const revenueDots = useMemo(() => {
    return chartData
      .filter((point) => point.Revenue > 0)
      .map((point) => ({
        x: point.date,
        y: point['Unique visitors'],
        color: '#10b981', // emerald-500
      }))
  }, [chartData])

  const isLoading = isTimelineLoading || isVisitorsLoading

  // Custom tooltip to show revenue alongside visitors
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{
      value: number
      name: string
      payload: Record<string, unknown>
    }>
    label?: string
  }) => {
    if (!active || !payload?.[0]) return null

    const dataPoint = payload[0].payload
    const visitors = (dataPoint['Unique visitors'] as number) || 0
    const revenue = (dataPoint['Revenue'] as number) || 0

    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
              <span className="text-sm text-muted-foreground">Visitors</span>
            </div>
            <span className="text-sm font-medium tabular-nums text-foreground">
              {valueFormatter(visitors)}
            </span>
          </div>
          {revenue > 0 && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm text-muted-foreground">Revenue</span>
              </div>
              <span className="text-sm font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                ${revenue.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Tab Header - Tremor style */}
      <div className="flex border-b bg-muted/30">
        {/* Unique Visitors Tab */}
        <div className="flex">
          <div className="py-4 pl-5 pr-12 text-left bg-background border-b-2 border-primary -mb-px">
            <span className="block text-sm text-muted-foreground">
              Unique visitors
            </span>
            <span className="mt-1 block text-3xl font-semibold text-foreground">
              {isLoading ? '...' : formatCompact(totalVisitors)}
            </span>
          </div>
          <div className="border-r border-border" aria-hidden="true" />
        </div>

        {/* Live Visitors Indicator */}
        <div className="flex">
          <div className="py-4 pl-5 pr-12 text-left">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  isConnected
                    ? 'bg-green-500 animate-pulse'
                    : 'bg-muted-foreground',
                )}
              />
              Live
            </span>
            <span className="mt-1 block text-3xl font-semibold text-foreground">
              {liveCount}
            </span>
          </div>
          <div className="border-r border-border" aria-hidden="true" />
        </div>

        {/* Revenue for Period */}
        {totalRevenue > 0 && (
          <div className="flex">
            <div className="py-4 pl-5 pr-12 text-left">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Revenue
              </span>
              <span className="mt-1 block text-3xl font-semibold text-emerald-600 dark:text-emerald-400">
                ${formatCompact(totalRevenue)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chart Panel */}
      <div className="p-6">
        {isTimelineLoading ? (
          <div className="flex items-center justify-center h-80">
            <p className="text-sm text-muted-foreground">Loading chart...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-80">
            <p className="text-sm text-muted-foreground">
              No data available for this period
            </p>
          </div>
        ) : (
          <>
            {/* Desktop chart */}
            <div className="hidden sm:block">
              <AreaChart
                data={chartData}
                index="date"
                categories={['Unique visitors']}
                valueFormatter={valueFormatter}
                showLegend={false}
                className="h-80"
                fill="gradient"
                customTooltip={CustomTooltip}
                referenceDots={revenueDots}
              />
            </div>
            {/* Mobile chart */}
            <div className="sm:hidden">
              <AreaChart
                data={chartData}
                index="date"
                categories={['Unique visitors']}
                valueFormatter={valueFormatter}
                showLegend={false}
                showYAxis={false}
                startEndOnly={true}
                className="h-64"
                fill="gradient"
                customTooltip={CustomTooltip}
                referenceDots={revenueDots}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * Top Pages and Sources Cards
 */
export function TopPagesAndSourcesCards() {
  const { storedValues } = useAppContext()
  const [modal, setModal] = useState<ModalState>({
    open: false,
    category: 'pages',
  })
  const [searchQuery, setSearchQuery] = useState('')

  const params = {
    project_id: storedValues!.projectId as string,
    time_range: storedValues?.timeRange || 'last_7_days',
  }

  const { data: pagesData, isLoading: isPagesLoading } =
    useTopEntryPagesTile(params)
  const { data: referrerData, isLoading: isReferrerLoading } =
    useTrafficByReferrerTile(params)

  // Process pages data for BarList
  const pagesBarData = useMemo(() => {
    const pages = pagesData?.data || []
    return pages.map((page) => ({
      name: trimPagePath(page.page || '/'),
      value: page.count || 0,
      key: page.page || '/',
    }))
  }, [pagesData])

  // Process referrer data for BarList
  const sourcesBarData = useMemo(() => {
    const referrers = referrerData?.data || []
    return referrers.map((ref) => ({
      name: ref.referer_url || 'Direct',
      value: ref.count || 0,
      key: ref.referer_url || 'direct',
    }))
  }, [referrerData])

  // Category configuration for the cards
  const categories = [
    {
      id: 'pages' as const,
      name: 'Top Pages',
      type: 'Visitors',
      data: pagesBarData,
      isLoading: isPagesLoading,
    },
    {
      id: 'sources' as const,
      name: 'Top Sources',
      type: 'Visitors',
      data: sourcesBarData,
      isLoading: isReferrerLoading,
    },
  ]

  // Filter modal data
  const modalCategory = categories.find((c) => c.id === modal.category)
  const filteredModalData =
    modalCategory?.data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden"
          >
            <div className="p-6">
              {/* Consistent header style */}
              <div className="flex items-center justify-between pb-4">
                <h3 className="text-sm font-medium text-foreground">
                  {category.name}
                </h3>
                <span className="text-xs font-medium uppercase text-muted-foreground">
                  {category.type}
                </span>
              </div>

              {category.isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
              ) : category.data.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No data available
                  </p>
                </div>
              ) : (
                <>
                  <BarList
                    data={category.data.slice(0, 5)}
                    valueFormatter={valueFormatter}
                    color="bg-orange-500"
                  />

                  {/* Gradient overlay and show more button */}
                  {category.data.length > 5 && (
                    <div className="absolute inset-x-0 bottom-0 flex justify-center rounded-b-lg bg-gradient-to-t from-background to-transparent py-7">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 rounded-full shadow-sm"
                        onClick={() =>
                          setModal({
                            open: true,
                            category: category.id,
                          })
                        }
                      >
                        Show more
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show More Dialog */}
      <Dialog
        open={modal.open}
        onOpenChange={(open) => {
          setModal((prev) => ({ ...prev, open }))
          if (!open) setSearchQuery('')
        }}
      >
        <DialogContent className="sm:max-w-lg p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center justify-between pt-4">
              <DialogTitle className="text-sm font-medium">
                {modalCategory?.name || 'Pages'}
              </DialogTitle>
              <span className="text-xs font-medium uppercase text-muted-foreground">
                {modalCategory?.type || 'Visitors'}
              </span>
            </div>
          </DialogHeader>

          <div className="h-96 overflow-y-auto px-6">
            {filteredModalData.length > 0 ? (
              <BarList
                data={filteredModalData}
                valueFormatter={valueFormatter}
                color="bg-orange-500"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">No results.</p>
              </div>
            )}
          </div>

          <div className="border-t bg-muted/50 p-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSearchQuery('')
                setModal((prev) => ({ ...prev, open: false }))
              }}
            >
              Go back
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

/**
 * @deprecated Use VisitorTimelineChart and TopPagesAndSourcesCards separately
 */
export function WebAnalyticsDashboard() {
  return (
    <div className="space-y-8">
      <VisitorTimelineChart />
      <TopPagesAndSourcesCards />
    </div>
  )
}
