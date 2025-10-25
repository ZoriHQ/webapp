import { useQuery } from '@tanstack/react-query'
import type Zoriapi from 'zorihq'
import { useApiClient } from '@/lib/api-client'

export type TimeRange =
  | 'last_hour'
  | 'today'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'

/**
 * Get key revenue metrics including total revenue, conversion rate, and average order value
 */
export function useRevenueDashboard(projectId: string, timeRange: TimeRange) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Revenue.DashboardResponse>({
    queryKey: ['revenue', 'dashboard', projectId, timeRange],
    queryFn: () =>
      zClient.v1.revenue.dashboard({
        project_id: projectId,
        time_range: timeRange,
      }),
    enabled: !!projectId,
  })
}

/**
 * Get revenue metrics over time for chart visualization
 */
export function useRevenueTimeline(projectId: string, timeRange: TimeRange) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Revenue.TimelineResponse>({
    queryKey: ['revenue', 'timeline', projectId, timeRange],
    queryFn: () =>
      zClient.v1.revenue.timeline({
        project_id: projectId,
        time_range: timeRange,
      }),
    enabled: !!projectId,
  })
}

/**
 * Get revenue attribution by traffic origin (referrer domain)
 */
export function useRevenueByOrigin(projectId: string, timeRange: TimeRange) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Revenue.AttributionByOriginResponse>({
    queryKey: ['revenue', 'attribution', 'origin', projectId, timeRange],
    queryFn: () =>
      zClient.v1.revenue.attribution.byOrigin({
        project_id: projectId,
        time_range: timeRange,
      }),
    enabled: !!projectId,
  })
}

/**
 * Get revenue attribution by UTM parameters
 */
export function useRevenueByUtm(
  projectId: string,
  timeRange: TimeRange,
  utmType?: string,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Revenue.AttributionByUtmResponse>({
    queryKey: ['revenue', 'attribution', 'utm', projectId, timeRange, utmType],
    queryFn: () =>
      zClient.v1.revenue.attribution.byUtm({
        project_id: projectId,
        time_range: timeRange,
        utm_type: utmType,
      }),
    enabled: !!projectId,
  })
}

/**
 * Get top customers by revenue
 */
export function useTopCustomers(
  projectId: string,
  timeRange: TimeRange,
  limit?: number,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Revenue.TopCustomersResponse>({
    queryKey: ['revenue', 'customers', 'top', projectId, timeRange, limit],
    queryFn: () =>
      zClient.v1.revenue.customers.top({
        project_id: projectId,
        time_range: timeRange,
        limit,
      }),
    enabled: !!projectId,
  })
}

/**
 * Get detailed revenue profile for a specific customer
 */
export function useCustomerProfile(
  projectId: string,
  visitorId: string | null,
) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Revenue.CustomerProfileResponse>({
    queryKey: ['revenue', 'customers', 'profile', projectId, visitorId],
    queryFn: () =>
      zClient.v1.revenue.customers.profile({
        project_id: projectId,
        visitor_id: visitorId!,
      }),
    enabled: !!projectId && !!visitorId,
  })
}

/**
 * Get conversion funnel metrics
 */
export function useConversionMetrics(projectId: string, timeRange: TimeRange) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Revenue.ConversionMetricsResponse>({
    queryKey: ['revenue', 'conversion', 'metrics', projectId, timeRange],
    queryFn: () =>
      zClient.v1.revenue.conversion.metrics({
        project_id: projectId,
        time_range: timeRange,
      }),
    enabled: !!projectId,
  })
}
