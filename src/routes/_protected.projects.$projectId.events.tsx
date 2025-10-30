import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import type { EventFiltersState } from '@/components/analytics/events-filter-bar'
import { useProject } from '@/hooks/use-projects'
import { useEventFilterOptions, useRecentEvents } from '@/hooks/use-analytics'
import { LiveEventStream } from '@/components/analytics/live-event-stream'
import { VisitorProfileModal } from '@/components/analytics/visitor-profile-modal'
import { EventsFilterBar } from '@/components/analytics/events-filter-bar'

const eventsSearchSchema = z.object({
  pages: z.array(z.string()).optional().catch([]),
  origins: z.array(z.string()).optional().catch([]),
  visitor_id: z.string().optional().catch(undefined),
  limit: z.number().optional().catch(100),
  offset: z.number().optional().catch(0),
})

export const Route = createFileRoute('/_protected/projects/$projectId/events')({
  component: EventsPage,
  validateSearch: eventsSearchSchema,
})

function EventsPage() {
  const { projectId } = Route.useParams()
  const navigate = Route.useNavigate()
  const searchParams = Route.useSearch()
  const queryClient = useQueryClient()

  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(
    null,
  )
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false)

  const { data: projectData, isLoading: projectLoading } = useProject(projectId)

  // Fetch available filter options
  const { data: filterOptionsData, isLoading: filterOptionsLoading } =
    useEventFilterOptions(projectId, 'last_7_days')

  // Build filter object from URL params
  const eventFilters = {
    limit: searchParams.limit || 100,
    offset: searchParams.offset || 0,
    ...(searchParams.visitor_id && {
      visitor_id: searchParams.visitor_id,
    }),
    ...(searchParams.pages &&
      searchParams.pages.length > 0 && {
        page_path: searchParams.pages.join(','),
      }),
    ...(searchParams.origins &&
      searchParams.origins.length > 0 && {
        traffic_origin: searchParams.origins.join(','),
      }),
  }

  const { data: recentEventsData, isLoading: eventsLoading } = useRecentEvents(
    projectId,
    eventFilters,
  )

  const handleVisitorClick = (visitorId: string) => {
    setSelectedVisitorId(visitorId)
    setIsVisitorModalOpen(true)
  }

  const handleFilterByVisitor = (visitorId: string) => {
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        visitor_id: visitorId,
      }),
    })
  }

  const handleFiltersChange = (filters: EventFiltersState) => {
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        visitor_id: filters.visitor_id || undefined,
        pages: filters.pages.length > 0 ? filters.pages : undefined,
        origins:
          filters.traffic_origins.length > 0
            ? filters.traffic_origins
            : undefined,
      }),
    })
  }

  const currentFilters: EventFiltersState = {
    visitor_id: searchParams.visitor_id,
    pages: searchParams.pages || [],
    traffic_origins: searchParams.origins || [],
  }

  const handleRefresh = () => {
    // Invalidate the events query to refetch
    queryClient.invalidateQueries({
      queryKey: ['analytics', 'events', 'recent', projectId],
    })
    // Also invalidate filter options
    queryClient.invalidateQueries({
      queryKey: ['analytics', 'events', 'filterOptions', projectId],
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Events</h1>
          <p className="text-muted-foreground">
            Real-time event stream for {projectData?.name || 'your project'}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <EventsFilterBar
        filters={currentFilters}
        availablePages={filterOptionsData?.pages || []}
        availableOrigins={filterOptionsData?.traffic_origins || []}
        onFiltersChange={handleFiltersChange}
        onRefresh={handleRefresh}
        isLoadingOptions={filterOptionsLoading}
      />

      <LiveEventStream
        events={recentEventsData?.events}
        isLoading={eventsLoading}
        onVisitorClick={handleVisitorClick}
        onFilterByVisitor={handleFilterByVisitor}
        total={recentEventsData?.total}
        limit={eventFilters.limit}
        offset={eventFilters.offset}
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
