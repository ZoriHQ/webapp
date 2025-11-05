import Zoriapi from 'zorihq'
import { useAuth } from './auth'
import { handleUnauthorized } from '@/lib/auth/unauthorized-handler'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:1323'

/**
 * Creates a Zoriapi client with dynamic token injection
 * @param getToken - Async function that returns the current auth token
 * @returns Configured Zoriapi client
 */
export function createApiClient(
  getToken: () => Promise<string | null>,
): Zoriapi {
  const customFetch: typeof fetch = async (input, init) => {
    const token = await getToken()

    const headers = new Headers(init?.headers)
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(input, {
      ...init,
      headers,
    })

    if (response.status === 401) {
      handleUnauthorized()
    }

    return response
  }

  const client = new Zoriapi({
    baseURL: API_BASE_URL,
    apiKey: '__BLANK__',
    fetch: customFetch,
  })

  return client
}

/**
 * React hook that creates an API client with automatic token injection
 * Uses the auth context to get the token function automatically
 * @returns Configured Zoriapi client
 */
export function useApiClient(): Zoriapi {
  const auth = useAuth()
  return createApiClient(auth.getToken)
}
