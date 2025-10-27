import Zoriapi from 'zorihq'
import { useUser } from '@stackframe/react'
import { useCallback, useEffect, useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:1323'

export function useApiClient() {
  const user = useUser()
  const [accessToken, setAccessToken] = useState<string>('__empty__')

  useEffect(() => {
    async function fetchToken() {
      if (user) {
        try {
          const tokens = await user.currentSession.getTokens()

          const token = tokens.accessToken || '__empty__'
          setAccessToken(token)
        } catch (error) {
          console.error('Failed to get auth token:', error)
          setAccessToken('__empty__')
        }
      } else {
        setAccessToken('__empty__')
      }
    }

    fetchToken()
  }, [user])

  console.log('useApiClient - Creating Zoriapi client with token:', accessToken)

  if (accessToken === '__empty__') {
    console.log('useApiClient - No token, setting __empty__')
    return null
  }

  const zclient = new Zoriapi({
    baseURL: API_BASE_URL,
    apiKey: accessToken,
  })

  return zclient
}
