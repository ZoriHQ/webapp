import Zoriapi from 'zorihq'
import { useEffect, useState } from 'react'
import { useAuthState } from '@/lib/auth'
import { handleUnauthorized } from '@/lib/auth/unauthorized-handler'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:1323'

/**
 * Wraps the Zoriapi client to intercept 401 errors
 */
function createInterceptedClient(token: string): Zoriapi {
  const client = new Zoriapi({
    baseURL: API_BASE_URL,
    apiKey: token,
  })

  // Wrap all client methods to intercept 401 errors
  // We create a proxy that catches errors from API calls
  return new Proxy(client, {
    get(target, prop) {
      const original = target[prop as keyof Zoriapi]

      // Only intercept objects (resources like projects, analytics, etc.)
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (typeof original === 'object' && original !== null) {
        return new Proxy(original, {
          get(methodTarget, methodProp) {
            const method = methodTarget[methodProp as keyof typeof methodTarget]

            if (typeof method === 'function') {
               
              return async (...args: Array<any>) => {
                try {
                   
                  const result = await (method as any).apply(methodTarget, args)
                  return result
                } catch (error: unknown) {
                  // Check if error is 401
                  if (
                    error !== null &&
                    typeof error === 'object' &&
                    'status' in error
                  ) {
                    if ((error as { status: number }).status === 401) {
                      handleUnauthorized()
                    }
                  }
                  throw error
                }
              }
            }

            return method
          },
        })
      }

      return original
    },
  })
}

export function useApiClient(): Zoriapi | null {
  const { getToken } = useAuthState()
  const [accessToken, setAccessToken] = useState<string>('__empty__')

  useEffect(() => {
    async function fetchToken() {
      try {
        const token = await getToken()
        setAccessToken(token || '__empty__')
      } catch (error) {
        console.error('Failed to get auth token:', error)
        setAccessToken('__empty__')
      }
    }

    fetchToken()
  }, [getToken])

  if (accessToken === '__empty__') {
    return null
  }

  return createInterceptedClient(accessToken)
}
