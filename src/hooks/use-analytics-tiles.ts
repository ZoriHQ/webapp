import { useQuery } from '@tanstack/react-query'
import type { Zoriapi } from 'zorihq'
import { useApiClient } from '@/lib/api-client'

export function useTopUniqueVisitorsTile(
  params: Zoriapi.V1.Analytics.Tiles.TileGetUniqueVisitorsParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TileGetUniqueVisitorsResponse>({
    queryKey: ['topUniqueVisitors', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.TileGetUniqueVisitorsResponse> =>
      zClient.v1.analytics.tiles.getUniqueVisitors(params),
  })
}

export function useBounceRateTile(
  params: Zoriapi.V1.Analytics.Tiles.TileGetBounceRateParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TileGetBounceRateResponse>({
    queryKey: ['bounceRate', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.TileGetBounceRateResponse> =>
      zClient.v1.analytics.tiles.getBounceRate(params),
  })
}

export function usePagesPerSessionTile(
  params: Zoriapi.V1.Analytics.Tiles.TileGetPagesPerSessionParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TileGetPagesPerSessionResponse>({
    queryKey: ['pagesPerSession', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.TileGetPagesPerSessionResponse> =>
      zClient.v1.analytics.tiles.getPagesPerSession(params),
  })
}

export function useReturnRateTile(
  params: Zoriapi.V1.Analytics.Tiles.TileGetReturnRateParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TileGetReturnRateResponse>({
    queryKey: ['returnRate', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.TileGetReturnRateResponse> =>
      zClient.v1.analytics.tiles.getReturnRate(params),
  })
}

export function useSessionDurationTile(
  params: Zoriapi.V1.Analytics.Tiles.TileGetSessionDurationParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TileGetSessionDurationResponse>({
    queryKey: ['sessionDuration', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.TileGetSessionDurationResponse> =>
      zClient.v1.analytics.tiles.getSessionDuration(params),
  })
}

export function useUniqueSessionsTile(
  params: Zoriapi.V1.Analytics.Tiles.TileGetUniqueSessionsParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TileGetUniqueSessionsResponse>({
    queryKey: ['sessions', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.TileGetUniqueSessionsResponse> =>
      zClient.v1.analytics.tiles.getUniqueSessions(params),
  })
}

export function useTimeBetweenVisitsTile(
  params: Zoriapi.V1.Analytics.Tiles.TileGetTimeBetweenVisitsParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TileGetTimeBetweenVisitsResponse>({
    queryKey: ['timeBetweenVisits', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.TileGetTimeBetweenVisitsResponse> =>
      zClient.v1.analytics.tiles.getTimeBetweenVisits(params),
  })
}

export function useTrafficByCountryTile(
  params: Zoriapi.V1.Analytics.TileGetTrafficByCountryParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TileGetTrafficByCountryResponse>({
    queryKey: ['trafficByCountry', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.TileGetTrafficByCountryResponse> =>
      zClient.v1.analytics.tiles.getTrafficByCountry(params)
  })
}

export function useTrafficByReferrerTile(
  params: Zoriapi.V1.Analytics.Tiles.TileGetTrafficByRefererParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TileGetTrafficByRefererResponse>({
    queryKey: ['trafficByReferrer', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.TileGetTrafficByRefererResponse> =>
      zClient.v1.analytics.tiles.getTrafficByReferer(params),
  })
}

export function useDauTile(params: Zoriapi.V1.Analytics.Tiles.TileGetDailyActiveUsersParams) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TileGetDailyActiveUsersResponse>({
    queryKey: ['useDauTile', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.TileGetDailyActiveUsersResponse> =>
      zClient.v1.analytics.tiles.getDailyActiveUsers(params),
  })
}

export function useWauTile(params: Zoriapi.V1.Analytics.Tiles.TileGetWeeklyActiveUsersParams) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TileGetWeeklyActiveUsersResponse>({
    queryKey: ['useWauTile', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.TileGetWeeklyActiveUsersResponse> =>
      zClient.v1.analytics.tiles.getWeeklyActiveUsers(params),
  })
}

export function useMauTile(params: Zoriapi.V1.Analytics.Tiles.TileGetMonthlyActiveUsersParams) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TileGetMonthlyActiveUsersResponse>({
    queryKey: ['useMauTile', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.TileGetMonthlyActiveUsersResponse> =>
      zClient.v1.analytics.tiles.getMonthlyActiveUsers(params)
  })
}

export function useTrafficByUTMTile(
  params: Zoriapi.V1.Analytics.Tiles.TileGetTrafficByUtmParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TileGetTrafficByUtmResponse>({
    queryKey: ['trafficByUTM', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.TileGetTrafficByUtmResponse> =>
      zClient.v1.analytics.tiles.getTrafficByUtm(params)
  })
}
