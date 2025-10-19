import { useQuery } from '@tanstack/react-query'
import type Zoriapi from 'zorihq'
import { useApiClient } from '@/lib/api-client'

export type TimeRange =
  | 'last_hour'
  | 'today'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'

export function useRecentEvents(projectId: string, limit?: number) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.RecentEventsResponse>({
    queryKey: ['analytics', 'events', 'recent', projectId, limit],
    queryFn: () =>
      zClient.v1.analytics.events.recent({ project_id: projectId, limit }),
    enabled: !!projectId,
  })
}

export function useVisitorsByCountry(projectId: string, timeRange: TimeRange) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.VisitorsByCountryResponse>({
    queryKey: ['analytics', 'visitors', 'country', projectId, timeRange],
    queryFn: () =>
      zClient.v1.analytics.visitors.byCountry({
        project_id: projectId,
        time_range: timeRange,
      }),
    enabled: !!projectId,
  })
}

export function useVisitorsByOrigin(projectId: string, timeRange: TimeRange) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.VisitorsByOriginResponse>({
    queryKey: ['analytics', 'visitors', 'origin', projectId, timeRange],
    queryFn: () =>
      zClient.v1.analytics.visitors.byOrigin({
        project_id: projectId,
        time_range: timeRange,
      }),
    enabled: !!projectId,
  })
}

export function useVisitorsByDevice(projectId: string, timeRange: TimeRange) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.VisitorsByDeviceResponse>({
    queryKey: ['analytics', 'visitors', 'device', projectId, timeRange],
    queryFn: () =>
      zClient.v1.analytics.visitors.byDevice({
        project_id: projectId,
        time_range: timeRange,
      }),
    enabled: !!projectId,
  })
}

export function useVisitorProfile(projectId: string, visitorId: string | null) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.VisitorProfileResponse>({
    queryKey: ['analytics', 'visitors', 'profile', projectId, visitorId],
    queryFn: async () => {
      console.log('[useVisitorProfile] Fetching profile for:', {
        projectId,
        visitorId,
      })
      const result = await zClient.v1.analytics.visitors.profile({
        project_id: projectId,
        visitor_id: visitorId!,
      })
      console.log('[useVisitorProfile] Result:', result)
      return result
    },
    enabled: !!projectId && !!visitorId,
  })
}

export function useVisitorsTimeline(projectId: string, timeRange: TimeRange) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.UniqueVisitorsTimelineResponse>({
    queryKey: ['analytics', 'visitors', 'timeline', projectId, timeRange],
    queryFn: async () => {
      console.log('[useVisitorsTimeline] Fetching timeline for:', {
        projectId,
        timeRange,
      })
      console.log(
        '[useVisitorsTimeline] zClient.v1.analytics.visitors:',
        zClient.v1.analytics.visitors,
      )
      console.log(
        '[useVisitorsTimeline] typeof timeline:',
        typeof zClient.v1.analytics.visitors.timeline,
      )
      console.log(
        '[useVisitorsTimeline] typeof profile:',
        typeof zClient.v1.analytics.visitors.profile,
      )

      if (typeof zClient.v1.analytics.visitors.timeline !== 'function') {
        console.error(
          '[useVisitorsTimeline] timeline is not a function! Type:',
          typeof zClient.v1.analytics.visitors.timeline,
        )
        throw new Error('timeline method not available on visitors API')
      }

      const result = await zClient.v1.analytics.visitors.timeline({
        project_id: projectId,
        time_range: timeRange,
      })
      console.log('[useVisitorsTimeline] Result:', result)
      return result
    },
    enabled: !!projectId,
  })
}
