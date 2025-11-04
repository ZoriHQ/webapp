import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type Zoriapi from 'zorihq'
import { useApiClient } from '@/lib/api-client'

export type TimeRange =
  | 'last_hour'
  | 'today'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'

export interface EventFilters {
  visitor_id?: string
  user_id?: string
  external_id?: string
  traffic_origin?: string
  page_path?: string
  limit?: number
  offset?: number
}

export function useRecentEvents(
  params: Zoriapi.V1.Analytics.Events.EventRecentParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.RecentEventsResponse>({
    queryKey: [
      'analytics',
      'events',
      'recent',
      params.project_id,
      params.time_range,
      params.visitor_id,
      params.pagePath,
      params.trafficOrigin,
      params.eventName,
      params.limit,
      params.offset,
    ],
    queryFn: () => zClient.v1.analytics.events.recent(params),
    enabled: !!params.project_id,
  })
}

export function useEventFilterOptions(
  projectId: string,
  timeRange?: TimeRange,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.EventFilterOptionsResponse>({
    queryKey: ['analytics', 'events', 'filterOptions', projectId, timeRange],
    queryFn: () =>
      zClient.v1.analytics.events.filterOptions({
        project_id: projectId,
        time_range: timeRange,
      }),
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

export function useDashboardMetrics(projectId: string, timeRange: TimeRange) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.DashboardMetricsResponse>({
    queryKey: ['analytics', 'dashboard', projectId, timeRange],
    queryFn: () =>
      zClient.v1.analytics.dashboard({
        project_id: projectId,
        time_range: timeRange,
      }),
    enabled: !!projectId,
  })
}

export function useSessionMetrics(projectId: string, timeRange: TimeRange) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.SessionMetricsResponse>({
    queryKey: ['analytics', 'sessions', 'metrics', projectId, timeRange],
    queryFn: () =>
      zClient.v1.analytics.sessions.metrics({
        project_id: projectId,
        time_range: timeRange,
      }),
    enabled: !!projectId,
  })
}

export function useBounceRate(
  projectId: string,
  timeRange: TimeRange,
  limit?: number,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.BounceRateResponse>({
    queryKey: [
      'analytics',
      'sessions',
      'bounceRate',
      projectId,
      timeRange,
      limit,
    ],
    queryFn: () =>
      zClient.v1.analytics.sessions.bounceRate({
        project_id: projectId,
        time_range: timeRange,
        limit,
      }),
    enabled: !!projectId,
  })
}

export function useActiveUsers(projectId: string) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.ActiveUsersResponse>({
    queryKey: ['analytics', 'users', 'active', projectId],
    queryFn: () =>
      zClient.v1.analytics.users.active({
        project_id: projectId,
      }),
    enabled: !!projectId,
  })
}

export function useChurnRate(
  projectId: string,
  timeRange: TimeRange,
  churnThresholdDays?: number,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.ChurnRateResponse>({
    queryKey: [
      'analytics',
      'retention',
      'churnRate',
      projectId,
      timeRange,
      churnThresholdDays,
    ],
    queryFn: () =>
      zClient.v1.analytics.retention.churnRate({
        project_id: projectId,
        time_range: timeRange,
        churn_threshold_days: churnThresholdDays,
      }),
    enabled: !!projectId,
  })
}

export function useReturnRate(projectId: string, timeRange: TimeRange) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.ReturnRateResponse>({
    queryKey: ['analytics', 'retention', 'returnRate', projectId, timeRange],
    queryFn: () =>
      zClient.v1.analytics.retention.returnRate({
        project_id: projectId,
        time_range: timeRange,
      }),
    enabled: !!projectId,
  })
}

export function useCohortAnalysis(projectId: string, timeRange: TimeRange) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.CohortAnalysisResponse>({
    queryKey: ['analytics', 'retention', 'cohorts', projectId, timeRange],
    queryFn: () =>
      zClient.v1.analytics.retention.cohorts({
        project_id: projectId,
        time_range: timeRange,
      }),
    enabled: !!projectId,
  })
}

export function useTopVisitors(
  projectId: string,
  timeRange: TimeRange,
  limit?: number,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TopVisitorsResponse>({
    queryKey: ['analytics', 'visitors', 'top', projectId, timeRange, limit],
    queryFn: () =>
      zClient.v1.analytics.visitors.top({
        project_id: projectId,
        time_range: timeRange,
        limit,
      }),
    enabled: !!projectId,
  })
}

export function useIdentifyVisitor(projectId: string) {
  const zClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<
    Zoriapi.V1.Analytics.ManualIdentifyResponse,
    Error,
    Omit<Zoriapi.V1.Analytics.ManualIdentifyRequest, 'project_id'>
  >({
    mutationFn: (data) =>
      zClient.v1.analytics.visitors.identify({
        project_id: projectId,
        ...data,
      }),
    onSuccess: (_, variables) => {
      // Invalidate the visitor profile query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: [
          'analytics',
          'visitors',
          'profile',
          projectId,
          variables.visitor_id,
        ],
      })
      // Also invalidate top visitors list in case it needs to update
      queryClient.invalidateQueries({
        queryKey: ['analytics', 'visitors', 'top', projectId],
      })
    },
  })
}
