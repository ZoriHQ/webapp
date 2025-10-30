/**
 * Extracts the domain from a URL string
 * @param urlOrDomain - Full URL or domain string
 * @returns Clean domain without www prefix
 */
export function extractDomain(urlOrDomain: string): string {
  if (!urlOrDomain) return ''

  try {
    // Try to parse as URL
    const url = new URL(
      urlOrDomain.startsWith('http') ? urlOrDomain : `https://${urlOrDomain}`,
    )
    return url.hostname.replace(/^www\./, '')
  } catch {
    // If not a valid URL, treat as domain and clean it
    return urlOrDomain.replace(/^www\./, '').split('/')[0]
  }
}

/**
 * Gets the favicon URL for a given domain using Google's favicon service
 * @param urlOrDomain - Full URL or domain string
 * @param size - Icon size (default: 32)
 * @returns Favicon URL from Google's service
 */
export function getFaviconUrl(urlOrDomain: string, size: number = 32): string {
  const domain = extractDomain(urlOrDomain)
  if (!domain) return ''

  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`
}
