import { useQuery } from '@tanstack/react-query'
import type { Zoriapi } from 'zorihq'
import { useApiClient } from '@/lib/api-client'

export function useTopUniqueVisitorsTile(
  params: Zoriapi.V1.Analytics.Tiles.TileUniqueVisitorsParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.UniqueVisitorsResponse>({
    queryKey: ['topUniqueVisitors', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.UniqueVisitorsResponse> =>
      zClient.v1.analytics.tiles.uniqueVisitors(params),
  })
}

export function useBounceRateTile(
  params: Zoriapi.V1.Analytics.Tiles.TileBounceRateParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.BounceRateResponse>({
    queryKey: ['bounceRate', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.BounceRateResponse> =>
      zClient.v1.analytics.tiles.bounceRate(params),
  })
}

export function usePagesPerSessionTile(
  params: Zoriapi.V1.Analytics.Tiles.TilePagesPerSessionParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.PagesPerSessionResponse>({
    queryKey: ['pagesPerSession', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.PagesPerSessionResponse> =>
      zClient.v1.analytics.tiles.pagesPerSession(params),
  })
}

export function useReturnRateTile(
  params: Zoriapi.V1.Analytics.Tiles.TileReturnRateParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.ReturnRateResponse>({
    queryKey: ['returnRate', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.ReturnRateResponse> =>
      zClient.v1.analytics.tiles.returnRate(params),
  })
}

export function useSessionDurationTile(
  params: Zoriapi.V1.Analytics.Tiles.TileSessionDurationParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.SessionDurationResponse>({
    queryKey: ['sessionDuration', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.SessionDurationResponse> =>
      zClient.v1.analytics.tiles.sessionDuration(params),
  })
}

export function useUniqueSessionsTile(
  params: Zoriapi.V1.Analytics.Tiles.TileUniqueSessionsParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.SessionDurationResponse>({
    queryKey: ['sessions', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.SessionDurationResponse> =>
      zClient.v1.analytics.tiles.sessionDuration(params),
  })
}

export function useTimeBetweenVisitsTile(
  params: Zoriapi.V1.Analytics.Tiles.TileTimeBetweenVisitsParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.TimeBetweenVisitsResponse>({
    queryKey: ['timeBetweenVisits', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.TimeBetweenVisitsResponse> =>
      zClient.v1.analytics.tiles.timeBetweenVisits(params),
  })
}

export function useTrafficByCountryTile(
  params: Zoriapi.V1.Analytics.Tiles.TileTrafficByCountryParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.CountryTrafficSourceResponse>({
    queryKey: ['trafficByCountry', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.CountryTrafficSourceResponse> =>
      zClient.v1.analytics.tiles.trafficByCountry(params),
  })
}

export function useTrafficByReferrerTile(
  params: Zoriapi.V1.Analytics.Tiles.TileTrafficByRefererParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.RefererTrafficSourceResponse>({
    queryKey: ['trafficByReferrer', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.RefererTrafficSourceResponse> =>
      zClient.v1.analytics.tiles.trafficByReferer(params),
  })
}

export function useDauTile(params: Zoriapi.V1.Analytics.Tiles.TileDauParams) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.DauResponse>({
    queryKey: ['useDauTile', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.DauResponse> =>
      zClient.v1.analytics.tiles.dau(params),
  })
}

export function useWauTile(params: Zoriapi.V1.Analytics.Tiles.TileWauParams) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.WauResponse>({
    queryKey: ['useWauTile', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.WauResponse> =>
      zClient.v1.analytics.tiles.wau(params),
  })
}

export function useMauTile(params: Zoriapi.V1.Analytics.Tiles.TileMauParams) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.MauResponse>({
    queryKey: ['useMauTile', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.MauResponse> =>
      zClient.v1.analytics.tiles.mau(params),
  })
}

export function useTrafficByUTMTile(
  params: Zoriapi.V1.Analytics.Tiles.TileTrafficByUtmParams,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Analytics.UtmTrafficSourceResponse>({
    queryKey: ['trafficByUTM', params],
    queryFn: (): Promise<Zoriapi.V1.Analytics.UtmTrafficSourceResponse> =>
      zClient.v1.analytics.tiles.trafficByUtm(params),
  })
}
