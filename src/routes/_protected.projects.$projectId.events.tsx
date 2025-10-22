import { createFileRoute } from '@tanstack/react-router'
import { useProject } from '@/hooks/use-projects'
import { useRecentEvents } from '@/hooks/use-analytics'
import { LiveEventStream } from '@/components/analytics/live-event-stream'
import { useState } from 'react'
import { VisitorProfileModal } from '@/components/analytics/visitor-profile-modal'

export const Route = createFileRoute('/_protected/projects/$projectId/events')({
  component: EventsPage,
})

function EventsPage() {
  const { projectId } = Route.useParams()
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(
    null,
  )
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false)

  const { data: projectData, isLoading: projectLoading } = useProject(projectId)
  const { data: recentEventsData, isLoading: eventsLoading } = useRecentEvents(
    projectId,
    100, // Load more events for the events page
  )

  const handleVisitorClick = (visitorId: string) => {
    setSelectedVisitorId(visitorId)
    setIsVisitorModalOpen(true)
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
