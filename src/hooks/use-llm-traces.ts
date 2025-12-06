import { useQuery } from '@tanstack/react-query'
import type { Zoriapi } from 'zorihq'
import { useApiClient } from '@/lib/api-client'

export type LlmTimeRange =
  | 'last_hour'
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'

export interface LlmTracesParams {
  project_id: string
  time_range: LlmTimeRange
  limit?: number
  offset?: number
  name?: string
  user_id?: string
  session_id?: string
  model?: string
  visitor_id?: string
  customer_id?: string
  referrer?: string
  utmtag?: string
  utmtagValue?: string
}

export function useLlmTraces(params: LlmTracesParams) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.LlmTracesListResponse>({
    queryKey: ['llmTraces', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.LlmTracesListResponse> =>
      zClient.v1.analytics.llm.traces(params),
    enabled: !!params.project_id,
  })
}

export function useLlmTracesFilterOptions(
  params: Pick<
    LlmTracesParams,
    | 'project_id'
    | 'time_range'
    | 'visitor_id'
    | 'customer_id'
    | 'referrer'
    | 'utmtag'
    | 'utmtagValue'
  >,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.LlmTraceFilterOptionsResponse>({
    queryKey: ['llmTracesFilterOptions', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.LlmTraceFilterOptionsResponse> =>
      zClient.v1.analytics.llm.tracesFilterOptions(params),
    enabled: !!params.project_id,
  })
}

export function useLlmCostTile(
  params: Zoriapi.V1.Analytics.Tiles.TileLlmCostParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.LlmCostResponse>({
    queryKey: ['llmCost', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.LlmCostResponse> =>
      zClient.v1.analytics.tiles.llmCost(params),
    enabled: !!params.project_id,
  })
}

export function useLlmTopModelsCostTile(
  params: Zoriapi.V1.Analytics.Tiles.TileLlmTopModelsCostParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.LlmTopModelsCostResponse>({
    queryKey: ['llmTopModelsCost', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.LlmTopModelsCostResponse> =>
      zClient.v1.analytics.tiles.llmTopModelsCost(params),
    enabled: !!params.project_id,
  })
}
