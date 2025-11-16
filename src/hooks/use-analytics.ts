import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type Zoriapi from 'zorihq'
import { useApiClient } from '@/lib/api-client'

export type TimeRange =
  | 'last_hour'
  | 'today'
  | 'yesterday'
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

// Custom types that match component expectations
export interface CountryDataPoint {
  country_code: string
  unique_visitors: number
  percentage: number
}

export interface OriginDataPoint {
  origin: string
  unique_visitors: number
  percentage: number
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
      params.page_path,
      params.traffic_origin,
      params.event_name,
      params.limit,
      params.offset,
    ],
    queryFn: () => zClient.v1.analytics.events.recent(params),
    enabled: !!params.project_id,
  })
}

export function useEventFilterOptions(
  params: Zoriapi.V1.Analytics.EventFilterOptionsParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.EventFilterOptionsResponse>({
    queryKey: [
      'analytics',
      'events',
      'filterOptions',
      params.project_id,
      params.time_range,
    ],
    queryFn: () => zClient.v1.analytics.events.filterOptions(params),
    enabled: !!params.project_id,
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

export function useVisitorsTimeline(
  params: Zoriapi.V1.Analytics.AnalyticsTimelineParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TimelineTileResponse>({
    queryKey: [
      'analytics',
      'visitors',
      'timeline',
      params.project_id,
      params.time_range,
    ],
    queryFn: async () => {
      return zClient.v1.analytics.timeline(params)
    },
    enabled: !!params.project_id,
  })
}

export function useChurnRate(
  params: Zoriapi.V1.Analytics.Retention.RetentionChurnRateParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.ChurnRateResponse>({
    queryKey: [
      'analytics',
      'retention',
      'churnRate',
      params.project_id,
      params.time_range,
    ],
    queryFn: () => zClient.v1.analytics.retention.churnRate(params),
    enabled: !!params.project_id,
  })
}

export function useTopVisitors(
  params: Zoriapi.V1.Analytics.Visitors.VisitorTopParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TopVisitorsResponse>({
    queryKey: [
      'analytics',
      'visitors',
      'top',
      params.project_id,
      params.time_range,
    ],
    queryFn: () => zClient.v1.analytics.visitors.top(params),
    enabled: !!params.project_id,
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
      queryClient.invalidateQueries({
        queryKey: [
          'analytics',
          'visitors',
          'profile',
          projectId,
          variables.visitor_id,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: ['analytics', 'visitors', 'top', projectId],
      })
    },
  })
}
