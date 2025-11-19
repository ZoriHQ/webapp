/**
 * Utility functions for determining traffic origin from visitor/customer data
 */

interface TrafficOriginData {
  first_traffic_origin?: string | null
  first_utm_source?: string | null
  first_utm_medium?: string | null
  first_utm_campaign?: string | null
  first_referrer_url?: string | null
}

/**
 * Determines the traffic origin display value from available data
 * Priority:
 * 1. first_traffic_origin if present
 * 2. UTM source if present
 * 3. Referrer URL if present
 * 4. "Direct" as fallback
 */
export function getTrafficOriginDisplay(data: TrafficOriginData): string {
  // Use first_traffic_origin if available
  if (data.first_traffic_origin) {
    return data.first_traffic_origin
  }

  // Try to derive from UTM parameters
  if (data.first_utm_source) {
    // Build a descriptive origin from UTM params
    let origin = data.first_utm_source

    if (data.first_utm_medium) {
      origin += ` (${data.first_utm_medium})`
    }

    if (data.first_utm_campaign) {
      origin += ` - ${data.first_utm_campaign}`
    }

    return origin
  }

  // Try to use referrer URL
  if (data.first_referrer_url) {
    try {
      const url = new URL(data.first_referrer_url)
      return url.hostname
    } catch {
      return data.first_referrer_url
    }
  }

  // Default to Direct
  return 'Direct'
}

/**
 * Gets a short version of the traffic origin (just the source, not medium/campaign)
 */
export function getTrafficOriginShort(data: TrafficOriginData): string {
  if (data.first_traffic_origin) {
    return data.first_traffic_origin
  }

  if (data.first_utm_source) {
    return data.first_utm_source
  }

  if (data.first_referrer_url) {
    try {
      const url = new URL(data.first_referrer_url)
      return url.hostname
    } catch {
      return data.first_referrer_url
    }
  }

  return 'Direct'
}
